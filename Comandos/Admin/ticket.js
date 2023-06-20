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
            .setAuthor({ name: `Sistema de atendicmento ${client.user.username}`, iconURL: client.user.displayAvatarURL({ dynamic: true }) })
            .setDescription("Para abrir um ticket, selecione uma das opções abaixo:")
            .setFooter({ text: 'Lembre-se: Não abra um ticket caso não haja necessidade!'});

            let panel = new Discord.ActionRowBuilder().addComponents(
                new Discord.StringSelectMenuBuilder()
                .setCustomId("painel_ticket")
                .setPlaceholder("Clique aqui para abrir um ticket!")
                .setOptions(
                    {
                        label: "Suporte",
                        emoji: "🗣️",
                        description: "Abra esse ticket se precisar de alguma ajuda.",
                        value: "suporte"
                    },
                    {
                        label: "Dúvidas",
                        emoji: "❓",
                        description: "Abra esse ticket caso tenho alguma dúvida.",
                        value: "duvidas"
                    },
                    {
                        label: "Denúncias",
                        emoji: "🚨",
                        description: "Abra esse ticket para denunciar algo..",
                        value: "denuncias"
                    }
                )
            );

            interaction.reply({ content: "✅ | Mensagem enviada!", ephemeral: true})
            interaction.channel.send({ embeds: [embed], components: [panel]})
        }
        
    }
}