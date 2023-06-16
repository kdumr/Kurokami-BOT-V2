const Discord = require("discord.js")

module.exports = {
    name: "addticket",
    description: "Adiciona um membro ao ticket!",
    type: Discord.ApplicationCommandType.ChatInput,
    default_member_permissions: "8",
    defaultPermission: true,
    options: [
        {
            name: "usuário",
            description: "Digite aqui o usuário que você deseja adiciona no ticket.",
            type: Discord.ApplicationCommandOptionType.User,
            required: true,
        }
    ],

    run: async (client, interaction) => {
        let categoria = "1117978267417325609"
        if (interaction.channel.parentId === categoria) {
            try {
                if (interaction.channel.permissionsFor(interaction.options.getUser("usuário")).has(Discord.PermissionFlagsBits.ViewChannel)) {
                    interaction.reply({ content: `> ❌ ${interaction.options.getUser("usuário")} já está no ticket`, ephemeral: true})
                } else {
                    interaction.channel.permissionOverwrites.edit(interaction.options.getUser("usuário").id, { ViewChannel: true, SendMessages: true, AttachFiles: true, EmbedLinks: true, AddReactions: true });
                    let addEmbed = new Discord.EmbedBuilder()
                    .setDescription(`${interaction.options.getUser("usuário")} **__foi adicionado__ no ticket por ${interaction.user}**`)
                    .setColor("#ff0000");
                    interaction.reply({ content: `> ✅ Você adicionou ${interaction.options.getUser("usuário")} com sucesso!`, ephemeral: true})
                    interaction.channel.send({ embeds: [addEmbed] }) 
                }
                
            } catch (erro) {
                console.error(erro)
            }
            
        } else {
            interaction.reply({ content: "> ❌ Esse canal não é um ticket", ephemeral: true})
        }
        
        
    }
}