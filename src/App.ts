import { checkEnv, processArgs, performAICall} from './helpers.js'
import colors from 'colors';


async function main() {
	const preferences = checkEnv();
	const { targetOS, humourStyle, terminalEmulator, openAIKey } = preferences;

	const frames = ['-', '\\', '|', '/'];
	let i = 0;

	const animationInterval = setInterval(() => {
	  process.stdout.write(`\r${colors.yellow('Waiting for response ' + frames[i++])}`);
	  i = i % frames.length;
	}, 200);

	try{
		const aiString = processArgs();
		const aiResponse = await performAICall(
			openAIKey, 
			aiString,
			terminalEmulator,targetOS, 
			humourStyle
		);
		clearInterval(animationInterval);
		process.stdout.write(`\r${colors.green('Response: ' + aiResponse)}`);
	} catch (error) {
		clearInterval(animationInterval);
		process.stdout.write(`\r${colors.red('Error calling OpenAI API: ' + error)}`);
	}
}

main();
