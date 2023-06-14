const Discord = require("discord.js")

module.exports = {
    name: "help",
    description: "painel de comandos do bot.",
    type: Discord.ApplicationCommandType.ChatInput,

    run: async (client, interaction) => {
        
        let embed_panel = new Discord.EmbedBuilder()
        .setColor("Aqua")
        .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL({ dynamic: true } )})
        .setDescription(`Olá, ${interaction.user}, veja meus comandos interagindo com o painel abaixo:`)

        let embed_utils = new Discord.EmbedBuilder()
        .setColor("Aqua")
        .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL({ dynamic: true } )})
        .setDescription(`Olá, ${interaction.user}, veja meus comandos de **Utilidades** abaixo:`)

        let embed_fun = new Discord.EmbedBuilder()
        .setColor("Aqua")
        .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL({ dynamic: true } )})
        .setDescription(`Olá, ${interaction.user}, veja meus comandos de **Diversão** abaixo:`)

        let panel = new Discord.ActionRowBuilder().addComponents(
            new Discord.SelectMenuBuilder()
            .setCustomId("painel_ticket")
            .setPlaceholder("Clique aqui!")
            .addOptions(
                {
                    label: "Painel inicial",
                    emoji: "⬜",
                    value: "panel"
                },
                {
                    label: "Utilidade",
                    description: "Veja meus comandos de utilidade.",
                    emoji: "✨",
                    value: "utils"
                },
                {
                    label: "Diversão",
                    description: "Veja meus comandos de diversão.",
                    emoji: "⚽",
                    value: "fun"
                }
            )
        )
        interaction.reply({ embeds: [embed_panel], components: [panel] }).then( () => {
            interaction.channel.createMessageComponentCollector().on("collect", (c) => {
                let valor = c.values[0];

                if (valor === "panel") {
                    c.deferUpdate()
                    interaction.editReply({ embeds: [embed_panel] })
                } else if (valor == "utils") {
                    c.deferUpdate()
                    interaction.editReply({ embeds: [embed_utils] })
                } else if (valor == "fun") {
                    c.deferUpdate()
                    interaction.editReply({ embeds: [embed_fun] })
                }
            })
        })
        
    }
}