const { REST, Routes } = require('discord.js');
const PromptFunction = require("prompt-sync")
const config = require("./config.json")

const dotenv = require('dotenv')
dotenv.config()
const { TOKEN, CLIENT_ID } = process.env

const rest = new REST().setToken(TOKEN);

// ...



// for global commands
rest.delete(Routes.applicationCommand("754013637718442175", '843138894995521546'))
	.then(() => console.log('Successfully deleted application command'))
	.catch(console.error);