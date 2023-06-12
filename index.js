const Discord = require("discord.js")

const config = require("./config.json")

const dotenv = require('dotenv')
dotenv.config()
const { TOKEN, CLIENT_ID } = process.env

const client = new Discord.Client({
    intents: [
        Discord.GatewayIntentBits.Guilds
    ]
});

module.exports = client

client.on('interactionCreate', (interaction) => {

    if (interaction.type === Discord.InteractionType.ApplicationCommand) {

        const cmd = client.slashCommands.get(interaction.commandName);

        // Mostra um erro se o comando não existir
        if (!cmd) return interaction.reply({ content: 'Esse comando não existe!', ephemeral: true });

        interaction["member"] = interaction.guild.members.cache.get(interaction.user.id);

        cmd.run(client, interaction)
    }
})

client.on('ready', () => {
    console.log("[Kurokami] - Iniciado!")
})

client.slashCommands = new Discord.Collection()

require('./handler')(client)

client.login(TOKEN)