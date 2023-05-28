import dotenv from "dotenv";
import fs from "fs";
import { IPreferences } from "./openai/IPreferences.js";
import { BridgeResponse, OpenAIBridge } from "./openai/OpenAIBridge.js";
import colors from 'colors';


const VERSION_SHORT = "-v";
const VERSION_LONG = "--version";

const HELP_SHORT = "-h";
const HELP_LONG = "--help";

const HELP_MESSAGE = `
Usage: ai [OPTIONS] [STRING]

Options:
  ${HELP_SHORT}, ${HELP_LONG}       Show this message and exit.
  ${VERSION_SHORT}, ${VERSION_LONG}   Show version info and exit.
`;

const ANIMATION_FRAMES = ['-', '\\', '|', '/'];
const SHOW_ANIMATION_TEXT =    "Waiting for response ";
const CLEAR_ANIMATION_TEXT = "\r                      ";


export const readVersion = (): string => {
	try{
		const rawText =	fs.readFileSync("package.json",  "utf8");
		const packageJson = JSON.parse(rawText);
		const version = packageJson.version;
		return version;
	} catch (error) {
		const errorMessage = `Could not read version: ${error}`;
		console.error(errorMessage);
		console.trace();
		throw new Error(errorMessage);
	}
}


export const checkEnv = (): IPreferences => {
	try{
		dotenv.config();
		const targetOS = process.env["TARGET_OS"];
		if (!targetOS) {
			throw new Error("Define 'TARGET_OS' in .env file in project's root");
		}
		const humourStyle = process.env["HUMOUR_STYLE"];
		if (!humourStyle) {
			throw new Error("Define 'HUMOUR_STYLE' in .env file in project's root");
		}
		const openAIKey = process.env["OPENAI_KEY"];
		if (!openAIKey) {
			throw new Error("Define 'OPENAI_KEY' in .env file in project's root");
		}
		const terminalEmulator = process.env["TERMINAL_EMULATOR"];
		if (!terminalEmulator) {
			throw new Error("Define 'TERMINAL_EMULATOR' in .env file in project's root");
		}
		return {
			targetOS,
			humourStyle,
			terminalEmulator,
			openAIKey
		};
	} catch (error) {
		const errorMessage = `INTERNAL ERROR - Could not load preferences: ${error}`;
		console.error(errorMessage);
		process.exit(9);
	}
}


export const processArgs = (): string => {
	const args = process.argv;
	if (args.length !=  3){
		console.error(HELP_MESSAGE)
		process.exit(9);
	}
	
	const userArgument = args[2];

	if (userArgument === HELP_SHORT || userArgument === HELP_LONG) {
		console.log(HELP_MESSAGE);
		process.exit(0);
	}
	if (userArgument === VERSION_SHORT || userArgument === VERSION_LONG) {
		const version = readVersion();
		console.log(`JNI's GPT on CLI v${version}`);
		process.exit(0);
	}
	return userArgument;
}


export const performAICall = async (
	userString: string,
	apiKey: string,
	terminalEmulator: string,
	targetOS: string,
	humourStyle: string,
): Promise<BridgeResponse> => {
	const aiBridge = new OpenAIBridge( terminalEmulator, targetOS, humourStyle, apiKey);
	const aiResponse1 = await aiBridge.requestResponse(userString);
	if (aiResponse1) {
		return aiResponse1;
	}
	const aiResponse2 = await aiBridge.requestResponse(userString);
	if (aiResponse2) {
		return aiResponse2;
	}
	throw new Error("OpenAI API returned empty response twice.");
}


export const animateWaiting = (): NodeJS.Timeout => {
	let i = 0;
	return setInterval(() => {
		const baseText = `Waiting for response ${ANIMATION_FRAMES[i++]}`;
		const colorizedText = `\r${colors.yellow(baseText)}`;	
		process.stdout.write(colorizedText);
		i = i % ANIMATION_FRAMES.length;
	}, 200);
}


export const presentResponse = (aiResponse: BridgeResponse): void => {
	process.stdout.write(CLEAR_ANIMATION_TEXT);
	process.stdout.write(`\r${colors.gray('Use:\n')}`);
	const text = 
`${colors.white(aiResponse.command)}
${colors.gray('\nComment: ')}
${colors.white(aiResponse.comment)}
\n`
	process.stdout.write(text);
}


export const presentError = (error: any): void => {
	process.stdout.write(CLEAR_ANIMATION_TEXT);
	const errorMessage = `Exiting with ${error}`;
	process.stdout.write(`\r${colors.red(errorMessage)}\n`);
}