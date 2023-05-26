import { IPreferences } from "./IPreferences.js";
import { Configuration, OpenAIApi } from "openai";

export class OpenAIBridge {
	
	private _openAIApi: OpenAIApi;

	constructor(private _preferences: IPreferences) {
		const config = new Configuration({
			apiKey: _preferences.openAIKey
		});
		this._openAIApi = new OpenAIApi(config);
	}

	public async getCompletion(userArgument: string): Promise<string> {
		try {
			const response = await this._openAIApi.createChatCompletion({
				model: "gpt-3.5-turbo",
				messages: [
					{
						"role": "user",
						"content": `
						 	Your task is to react accordingly to the a users input.
							The rules are as follows:
							The user communicates via the command line from a terminal emulator.
							The user's terminal emulator is ${this._preferences.terminalEmulator}.
							Depending on the terminal emulator style you can use color and 
							unicode characters.
							The user's operating system is ${this._preferences.targetOS}.
							The text of your response will be directly printed out to the user's terminal.
							Consequently do not use HTML or other markup languages in your answer.
							The user asks to solve a CLI problem or a general question.
							(1) If the user is asking how to solve a problem with the CLI provide
							the command so it could be copy-pasted by the user. Avoid
							explanations unless the user explicitly asked for them.
							Always break the line before and after the command.
							(2) If the user asks a general question give do not use more than 5 sentences.
							The prefers the following style of homour in your response: 
							${this._preferences.humourStyle}.
							These were the rulse.
							This is the user's input:
							${userArgument}
						`
					}
				]

			});
			const responseText = response.data.choices[0].message?.content;
			if (!responseText) {
				throw new Error("Response from OpenAI API was empty");
			}
			return responseText;
		}
		catch (error) {
			throw new Error("Error calling OpenAI API: " + error);
		}
	}
}