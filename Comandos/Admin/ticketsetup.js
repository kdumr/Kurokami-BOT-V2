const Discord = require("discord.js")

const serverSchema = require("../../Schemas/serverSchema");


module.exports = {
    name: "ticketsetup",
    description: "Configure o bot para receber tickets.",
    type: Discord.ApplicationCommandType.ChatInput,
    options: [
        {
            name: 'categoria',
            description: 'Use este comando para criar a categoria onde ficarão armazenados os tickets!',
            type: Discord.ApplicationCommandOptionType.Subcommand
        },
        {
            name: 'cargo',
            description: 'Use este comando para criar o cargo "Suporte"!',
            type: Discord.ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: 'nomedocargo',
                    description: 'Digite aqui o nome do cargo. Exemplo: Suporte',
                    type: Discord.ApplicationCommandOptionType.String,
                    required: true,
                }
            ]
        },
    ],

    run: async (client, interaction) => {
        if (interaction.options.getSubcommand() === 'categoria') {
            if (!interaction.member.permissions.has(Discord.PermissionFlagsBits.Administrator)) {
                interaction.reply({ content: "> ❌ Você não tem permissão para usar esse comando.", ephemeral: true })
            } else {
                const serverId = interaction.guild.id
                const filter = { serverId };
                const server = await serverSchema.findOne(filter)
    
                if (server && server.categoryTicket !== null && server.categoryTicket !== undefined && interaction.guild.channels.cache.get(server.categoryTicket) !== undefined) {
                    interaction.reply({ content: `> ❗ Já existe uma categoria de ticket adicionada no servidor!\n> ❗ ID da categoria: ${server.categoryTicket}`, ephemeral: true })
                    return;
                } else {
                    try {
                        interaction.guild.channels.create({
                            name: "TICKETS",
                            type: Discord.ChannelType.GuildCategory, })
                        .then(async (category) => {
                            const update = { $set: { categoryTicket: category.id}}
                            const options = { upsert: true, new: true };
    
                            await serverSchema.findOneAndUpdate(filter, update, options)
                            interaction.reply({ content: `> ✅ Categoria criada com sucesso!\nID da categoria: ${category.id}`, ephemeral: true })
                            })
                    } catch (error) {
                        interaction.reply({ content: `> ❌ Ocorreu um erro!`, ephemeral: true })
                        console.error(error)
                    }   
                }
            }
        } else if (interaction.options.getSubcommand() === 'cargo') {
            if (!interaction.member.permissions.has(Discord.PermissionFlagsBits.Administrator)) {
                interaction.reply({ content: "> ❌ Você não tem permissão para usar esse comando.", ephemeral: true })
            } else {
                const serverId = interaction.guild.id
                const filter = { serverId };
                const server = await serverSchema.findOne(filter)
    
                if (server && server.roleSupID !== null && server.roleSupID !== undefined && interaction.guild.roles.cache.find(role => role.id === server.roleSupID) !== undefined) {
                    interaction.reply({ content: `> ❗ Já existe um cargo de Suporte adicionado no servidor!\n> ❗ ID do cargo: ${server.roleSupID}`, ephemeral: true })
                    return;
                } else {
                    await interaction.deferReply();
                    const nameRole = interaction.options.getString('nomedocargo');

                    interaction.guild.roles.create({
                        name: `${nameRole}`,
                        color: "#ff5500",
                    }).then(async (role) => {
                        
                        const update = { $set: { roleSupID: role.id}};
                        const options = { upsert: true, new: true };

                        await serverSchema.findOneAndUpdate(filter, update, options)

                        embedSucess = new Discord.EmbedBuilder()
                        .setDescription(`> ✅ **Cargo <@&${role.id}> criado com sucesso!**`)
                        .setFooter({ text: "Lembrando que você pode mudar o nome e as permissões do cargo a qualquer momento!\n⚠ Atenção: Caso o cargo seja excluído, você deverá usar este comando novamente!"})
                        .setColor("#29ff00");

                        await interaction.editReply({ embeds: [embedSucess] });
                    })
                }
            }
        }
        
    }   

}