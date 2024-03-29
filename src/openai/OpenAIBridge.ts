import { Configuration, OpenAIApi } from "openai";

export type BridgeResponse = {
	command: string,
	comment: string
}


const cleanExtractBridgeResponse = (rawInput: string): BridgeResponse | null => {
	// Create a regex to capture a json string
	const jsonRegex = /{[^}]*}/g;
	
	// Extract JSON string
	const jsonMatch = rawInput.match(jsonRegex);
	if (!jsonMatch) {
		return null;
	}

	// Parse JSON string into a JavaScript object
	try {
		const parsedObject = JSON.parse(jsonMatch[0]);

		// Check if parsed object has the required fields
		if ('command' in parsedObject && 'comment' in parsedObject) {
			// Construct and return BridgeResponse object
			const bridgeResponse: BridgeResponse = {
				command: parsedObject.command,
				comment: parsedObject.comment
			};

			return bridgeResponse;
		} else {
			return null;
		}
	} catch (error) {
		return null;
	}
}


const constructPrompt = (
	userArgument: string,
	terminalEmulator: string,
	targetOS: string,
	humourStyle: string
): string => {
	const prompt = `
You will receive a user prompt.
Your task is to react following these rules:
Provide your answer in JSON form. Reply with only the answer in JSON form 
and include no other commentary
 Your response must match the following type:
{
	"command": "string",
	"comment": "string"
}
The user operates on the CLI and seeks for helping regarding a command or a combination 
of commands.
The user's terminal emulator is ${terminalEmulator}.
The user's operating system is ${targetOS}.
According to the JSON format, you must answer with a command and a comment.
The command represents your solution to the user's problem and should is meant to be executed.
If you can not find a solution, you can answer with "No solution found".

With your text meant for the comment field, explain your proposed command. You can also refer to the user's problem in general.
Do not answer with a comment only.
Use at most 5 sentences for the comment.
The user prefers the following style of humor for the comment: 
${humourStyle}.

USER PROMPT:
${userArgument}

\n\`\`\`json
`
	return prompt;
}


export class OpenAIBridge {
	
	private _openAIApi: OpenAIApi;

	constructor(
		apiKey: string,
		private _gptModel: string,
		private _terminalEmulator: string,
		private _targetOS: string,
		private _humourStyle: string,
	) {
		const config = new Configuration({
			apiKey: apiKey
		});
		this._openAIApi = new OpenAIApi(config);
	}

	public async requestResponse(userArgument: string): Promise<BridgeResponse | null> {
		try {
			const response = await this._openAIApi.createChatCompletion({
				// model: "gpt-4",  // Not yet available
				model: this._gptModel,
				messages: [
					{
						"role": "user",
						"content": constructPrompt(
							userArgument,
							this._terminalEmulator,
							this._targetOS,
							this._humourStyle
						)
					}
				]

			});
			const rawInput = response.data.choices[0].message?.content;
			if (!rawInput) {
				throw new Error("Response from OpenAI API was empty");
			}
			try{
				const bridgeRespone = cleanExtractBridgeResponse(rawInput);
				return bridgeRespone;
			}
			catch (error) {
				throw new Error("Could not parse JSON: " + error);
			}
		}
		catch (error) {
			throw new Error("Error calling OpenAI API: " + error);
		}
	}
}
