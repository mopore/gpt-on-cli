import dotenv from "dotenv";


async function main() {
	dotenv.config();
	const testEnvValue = process.env["TARGET_OS"] ?? "Define 'TARGET_OS' in .env file in project's root";

	const args = process.argv;
	if (args.length !=  3){
		console.error("Please provide one string argument to be passed to the GPT model.")
		process.exit(9);
	}
	console.log(`String argument: ${args[2]}`);
	console.log(`Test value: ${testEnvValue}`);
}

main();
