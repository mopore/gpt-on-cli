import * as h from './helpers.js';

async function main() {
	const pref = h.checkEnv();
	const userString = h.processArgs();

	const animationHandle = h.animateWaiting();
	try{
		const aiResponse = await h.performAICall(
			userString,
			pref.openAIKey,
			pref.gptModel, 
			pref.terminalEmulator,
			pref.targetOS, 
			pref.humourStyle
		);
		clearInterval(animationHandle);
		h.presentResponse(aiResponse);
	} catch (error) {
		clearInterval(animationHandle);
		h.presentError(error);
	}
}


main();