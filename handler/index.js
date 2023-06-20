const fs = require("fs")

module.exports = async (client) => {

    const SlashsArray = []

    fs.readdir(`./Comandos`, (error, folder) => {
        folder.forEach(subfolder => {
            fs.readdir(`./Comandos/${subfolder}/`, (error, files) => {
                files.forEach(files => {

                    if (!files?.endsWith('.js')) return;
                    files = require(`../Comandos/${subfolder}/${files}`);
                    if (!files?.name) return;
                    client.slashCommands.set(files?.name, files);

                    SlashsArray.push(files)
                });
            });
        });
    });
    // Adiciona os comandos quando o bot inicia
    client.on("ready", async () => {
        client.guilds.cache.forEach(guild => guild.commands.set(SlashsArray))
    });

    // Adiciona os comandos quando o bot entra no servidor
    client.on('guildCreate', async (guild) => {''
        
        // Carregar os comandos no servidor
        carregarComandos(guild);
      });
      
      // Função para carregar os comandos em um servidor específico
      async function carregarComandos(guild) {
        const SlashsArray = [];
      
        // Percorrer as pastas e subpastas dos comandos
        fs.readdir('./Comandos', (error, folder) => {
            
          folder.forEach(subfolder => {
            fs.readdir(`./Comandos/${subfolder}/`, (error, files) => {

              files.forEach(file => {
                if (!file.endsWith('.js')) return;
                const command = require(`../Comandos/${subfolder}/${file}`);
                if (!command?.name) return;

                SlashsArray.push(command);
              });
            });
          });
        });
      
        // Aguardar um pouco para garantir que os comandos sejam carregados corretamente
        await new Promise(resolve => setTimeout(resolve, 1000));
      
        // Registrar os comandos no servidor
        guild.commands.set(SlashsArray)
          .then(() => {
            console.log(`Comandos carregados no servidor: ${guild.name}`);
          })
          .catch(error => {
            console.error(`Erro ao carregar comandos no servidor: ${guild.name}`, error);
          });
      }
};