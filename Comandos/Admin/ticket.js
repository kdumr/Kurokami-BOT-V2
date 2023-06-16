const Discord = require("discord.js")

module.exports = {
    name: "ticket",
    description: "Abre o painel de tickets.",
    type: Discord.ApplicationCommandType.ChatInput,

    run: async (client, interaction) => {
        
        if (!interaction.member.permissions.has(Discord.PermissionFlagsBits.ManageGuild)) {
            interaction.reply({ content: `Você não possui permissão para utilizar este comando!`, ephemeral: true})
        } else {
            let embed = new Discord.EmbedBuilder()
            .setColor("Aqua")
            .setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true }) })
            .setDescription("Abra um ticket selecionando uma das opções abaixo:");

            let panel = new Discord.ActionRowBuilder().addComponents(
                new Discord.StringSelectMenuBuilder()
                .setCustomId("painel_ticket")
                .setPlaceholder("Clique aqui!")
                .setOptions(
                    {
                        label: "Suporte",
                        description: "Abra esse ticket se precisar de alguma ajuda .",
                        value: "suporte"
                    },
                    {
                        label: "Dúvidas",
                        description: "Abra um ticket na opção 2.",
                        value: "duvidas"
                    },
                    {
                        label: "Denúncias",
                        description: "Abra um ticket na opção 3.",
                        value: "denuncias"
                    }
                )
            );

            interaction.reply({ content: "✅ | Mensagem enviada!", ephemeral: true})
            interaction.channel.send({ embeds: [embed], components: [panel]})
        }
        
    }
}