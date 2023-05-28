import { checkEnv, processArgs, performAICall} from './helpers.js'


async function main() {
	const preferences = checkEnv();
	const { useColors, targetOS, humourStyle, terminalEmulator, openAIKey } = preferences;

	console.log(`useColors: ${useColors}`);

	const animationInterval = setInterval(() => {
		process.stdout.write('.');
	}, 1500);

	const aiString = processArgs();
	const aiResponse = await performAICall(
		openAIKey, 
		aiString,
		terminalEmulator,targetOS, 
		humourStyle
	);
	clearInterval(animationInterval);
	console.log();

	console.log(aiResponse);
}

main();
