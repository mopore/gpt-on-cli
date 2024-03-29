```
 ▄▄▄▄▄▄▄▄▄▄▄  ▄▄▄▄▄▄▄▄▄▄▄  ▄▄▄▄▄▄▄▄▄▄▄       ▄▄▄▄▄▄▄▄▄▄▄  ▄            ▄▄▄▄▄▄▄▄▄▄▄ 
▐░░░░░░░░░░░▌▐░░░░░░░░░░░▌▐░░░░░░░░░░░▌     ▐░░░░░░░░░░░▌▐░▌          ▐░░░░░░░░░░░▌
▐░█▀▀▀▀▀▀▀▀▀ ▐░█▀▀▀▀▀▀▀█░▌ ▀▀▀▀█░█▀▀▀▀      ▐░█▀▀▀▀▀▀▀▀▀ ▐░▌           ▀▀▀▀█░█▀▀▀▀ 
▐░▌          ▐░▌       ▐░▌     ▐░▌          ▐░▌          ▐░▌               ▐░▌     
▐░▌ ▄▄▄▄▄▄▄▄ ▐░█▄▄▄▄▄▄▄█░▌     ▐░▌          ▐░▌          ▐░▌               ▐░▌     
▐░▌▐░░░░░░░░▌▐░░░░░░░░░░░▌     ▐░▌          ▐░▌          ▐░▌               ▐░▌     
▐░▌ ▀▀▀▀▀▀█░▌▐░█▀▀▀▀▀▀▀▀▀      ▐░▌          ▐░▌          ▐░▌               ▐░▌     
▐░▌       ▐░▌▐░▌               ▐░▌          ▐░▌          ▐░▌               ▐░▌     
▐░█▄▄▄▄▄▄▄█░▌▐░▌               ▐░▌          ▐░█▄▄▄▄▄▄▄▄▄ ▐░█▄▄▄▄▄▄▄▄▄  ▄▄▄▄█░█▄▄▄▄ 
▐░░░░░░░░░░░▌▐░▌               ▐░▌          ▐░░░░░░░░░░░▌▐░░░░░░░░░░░▌▐░░░░░░░░░░░▌
 ▀▀▀▀▀▀▀▀▀▀▀  ▀                 ▀            ▀▀▀▀▀▀▀▀▀▀▀  ▀▀▀▀▀▀▀▀▀▀▀  ▀▀▀▀▀▀▀▀▀▀▀ 
                                                                                   
```

Source for ASCII-fonts: https://www.coolgenerator.com/ascii-text-generator
(Font: Electronic)


# What is this?
Provide access to GPT 3 model via CLI encapsulated as a docker container.

# What's the motivation?
To stay in the terminal when having a question (e.g. on how a certain command works)

# Setup

## Pre-requisites
Ensure to have docker installed and running.
An OpenAI API key.

## 1 Configure preferences and provide OpenAI API key
The GPT model will be prepared to give answers fitting to your environment and liking.
These preferences will be provided together with the API key in a .env file which will be stored inside the docker container.
Therefore it is not recommended to upload your  image to a public repository.

Create a new `.env' file in this root folder of this project. The `.env` is listed in the `.gitignore` file and will not be uploaded to the repository.
Feel free to experiment with your own values the perference properties. 

Here is an example:

```bash
GPT_MODEL = "gpt-4"
# GPT_MODEL = "gpt-3.5-turbo"

TARGET_OS = "Manjaro Linux"
# TARGET_OS = "Arch Linx"
# TARGET_OS = "MacOS"
# TARGET_OS = "Ubuntu"

# HUMOUR_STYLE = "none"
HUMOUR_STYLE = "friendly"
# HUMOUR_STYLE = "friendly ironic"
# HUMOUR_STYLE = "mean sarcastic"

TERMINAL_EMULATOR = "very simple"
# TERMINAL_EMULATOR = "Kitty"
# TERMINAL_EMULATOR = "Alacritty"
# TERMINAL_EMULATOR = "iTerm2"

OPENAI_KEY = "<your OpenAI API key>"
```

You  should have a similar project structure like this:
```
.
├── dist
├── node_modules
├── src
├── test
├── .vscode
├── .git
├── .env  <------------- Your config file
├── .eslintignore
├── .eslintrc.js
├── .gitignore
├── Dockerfile
├── package.json
├── pnpm-lock.yaml
├── README.md
├── gpt-on-cli.code-workspace
└── tsconfig.json
```

## 2 Create a local docker image
Run the following command inside the project root to create the local docker image:
```bash
docker buildx build -t jni-gpt-on-cli .
```
Alternatively you can run `pnpm run build-image` if you have pnpm installed.


## 3 Add an  alias to your .zshrc or .bashrc
Add the following lines to your `.zshrc` or `.bashrc` file:

```bash
# JNI's GPT on CLI
alias ai='docker container run --rm jni-gpt-on-cli'
```


# Usage
Pass your quoted question as an argument to the `ai` command:

![Usage example](./documentation/usage.png)
Result of `HUMOUR_STYLE = "friendly ironic"`


The general usage info reads  like this:
```bash
Usage: ai [OPTIONS] [STRING]

Options:
  -h, --help       Show this message and exit.
  -v, --version   Show version info and exit.
```

# Additional Information

## Project Maintenance
To update all packages to the latest version
`pnpm up --latest` to update all packages to the latest version.

To add a new package to the project
`pnpm add -D <package>` to add a package to the project. The `-D` flag is for development dependencies.


# Release History

## v0.3.0
- Add support for different GPT models.

## v0.2.2
- Tweak colors.

## v0.2.1
- Better handle unclean answers from GPT model.

## v0.2.0
- Improve AI prompt.
- Improve output formatting.
- Add color and improve waiting animation.
- General code cleanup and refactoring.

## v0.1.0
- Initial project version

