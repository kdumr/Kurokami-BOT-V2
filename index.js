const Discord = require("discord.js")
const { QuickDB } = require("quick.db")
const db = new QuickDB()

const config = require("./config.json")
const roleSupID = config.roleSupID

const dotenv = require('dotenv')
dotenv.config()
const { TOKEN, CLIENT_ID } = process.env

const client = new Discord.Client({
    intents: [
        Discord.GatewayIntentBits.Guilds
    ]
});

module.exports = client

//Cooldown
const cooldown = new Set();
//Digite quando minutos deseja de cooldown. Exemplo: cooldown = 5 (minutos)
let cooldownTimeMin = 5;
const cooldownTime = cooldownTimeMin * 300000

client.on('interactionCreate', (interaction) => {

    if (interaction.type === Discord.InteractionType.ApplicationCommand) {

        const cmd = client.slashCommands.get(interaction.commandName);

        // Mostra um erro se o comando não existir
        if (!cmd) return interaction.reply({ content: 'Esse comando não existe!', ephemeral: true });

        interaction["member"] = interaction.guild.members.cache.get(interaction.user.id);
        // Verifica se o usuário tem a permissão específica
        if (interaction.member.permissions.has(Discord.PermissionFlagsBits.Administrator)) {
          // Define a permissão do comando como true (visível)
          cmd.defaultPermission = true;
      }

        cmd.run(client, interaction)
    }
})

client.on('ready', () => {
    console.log("[Kurokami] - Iniciado!")
})


client.slashCommands = new Discord.Collection()

require('./handler')(client)

client.login(TOKEN)

const fs = require('fs')
const ticket = require("./Comandos/Admin/ticket")

fs.readdir('./Events', (err, file) => {
  file.forEach(event => {
    require(`./Events/${event}`)
  })
})