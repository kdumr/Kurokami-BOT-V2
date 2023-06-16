const dotenv = require('dotenv');
dotenv.config();

const { TOKEN, CLIENT_ID } = process.env;
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

const rest = new REST({ version: '9' }).setToken(TOKEN);

(async () => {
  try {
    const guilds = await rest.get(Routes.userGuilds(CLIENT_ID));

    for (const guild of guilds) {
      const commands = await rest.get(
        Routes.applicationGuildCommands(CLIENT_ID, guild.id)
      );

      if (commands.length === 0) {
        console.log(`Não há comandos de barra no servidor ${guild.name}`);
        continue;
      }

      await rest.put(
        Routes.applicationGuildCommands(CLIENT_ID, guild.id),
        { body: [] }
      );

      console.log(`Comandos de barra removidos com sucesso do servidor ${guild.name}`);
    }

    console.log('Todos os comandos de barra foram removidos de todos os servidores.');
  } catch (error) {
    console.error(error);
  }
})();
