import dotenv from "dotenv";
import * as fs from "fs";
import { IPreferences } from "./openai/IPreferences.js";
import { OpenAIBridge } from "./openai/OpenAIBridge.js";


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


const readVersion = (): string => {
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


const checkEnv = (): IPreferences => {
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


const processArgs = (): string => {
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


const performAICall = async (aiString: string, preferences: IPreferences): Promise<string> => {
	try {
		const aiBridge = new OpenAIBridge(preferences);
		const aiResponse = await aiBridge.getCompletion(aiString);
		return aiResponse;
	} catch (error) {
		const errorMessage = `SYSTEM ERROR - Could not get respone from AI: ${error}`;
		console.error(errorMessage);
		process.exit(9);
	}
}


async function main() {
	const preferences = checkEnv();
	const aiString = processArgs();

	const animationInterval = setInterval(() => {
		process.stdout.write('.');
	}, 1500);

	const aiResponse = await performAICall(aiString, preferences);
	clearInterval(animationInterval);
	console.log();

	console.log(aiResponse);
}

main();
