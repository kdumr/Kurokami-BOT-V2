const Discord = require("discord.js")
const { QuickDB } = require("quick.db")
//const db = new QuickDB()
const db = require('mongoose');
//const db = require("./Events/registerDB")
const serverSchema = require("./Schemas/serverSchema");

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

client.on('guildCreate', async (guild) => {
  console.log(`Novo servidor adicionado: ${guild.name}`);
  try {
    //const db = client.db('test');
    const newServer = new serverSchema({
      serverId: guild.id,
      serverName: guild.name,
      categoryTicket: null,
      roleSupID: null
    });
  
    await newServer.save();
    
    
    } catch (error) {
      console.error('[Database] -> Erro ao adicionar novo servidor:', error);
    }
  console.log("[Database] -> Adicionado no servidor: ", guild.name)
})

client.on('ready', async () => {
  
    console.log("[Kurokami] - Iniciado!")
})

client.on('guildMemberAdd', async (member) => {
  try {
    // Encontre o documento do servidor correspondente no banco de dados
    const server = await Server.findOne({ serverId: member.guild.id });

    if (server) {
      // Adicione o novo membro à lista de membros do servidor
      server.members.push(member.id);
      await server.save();
    }
  } catch (error) {
    console.error('Erro ao adicionar membro:', error);
  }
});

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