require('../index')

const Discord = require('discord.js')
const client = require('../index')

const serverSchema = require("../Schemas/serverSchema");

// ...

// Evento para detectar quando o bot é removido de um servidor
client.on("guildDelete", async (guild) => {
  try {
    const serverId = guild.id;

    // Remova o documento do servidor correspondente no banco de dados
    await serverSchema.findOneAndRemove({ serverId });

    console.log(`O bot foi removido do servidor: ${guild.name} (${guild.id})`);
    await console.log(`[Database] - Os registros desse servidor foram apagados!`);
  } catch (error) {
    console.error(`[Database] - Erro ao apagar os registros desse servidor: `, error);
  }
});