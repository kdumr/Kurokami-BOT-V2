const Discord = require("discord.js")

module.exports = {
    name: "ping",
    description: "Mostra o ping do bot.",
    type: Discord.ApplicationCommandType.ChatInput,

    run: async (client, interaction) => {
        let ping = client.ws.ping
        if (ping > 100) {
            color = "Red"
        } else {
            color = "Green"
        }

        let embed_2 = new Discord.EmbedBuilder()
            .setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL({ dynamic: true }) })
            .setDescription(`Olá ${interaction.user}, meu ping está em \`${ping} ms\`.`)
            .setColor(color)

        await interaction.deferReply().then( () => {
            setTimeout( () => {
                interaction.editReply({ embeds: [embed_2] })
            }, 2000)
        })
    }
}