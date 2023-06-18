const Discord = require("discord.js")
const serverSchema = require("../../Schemas/serverSchema");


module.exports = {
    name: "criarcategoria",
    description: "Crie uma categoria onde irão ficar os tickets.",
    type: Discord.ApplicationCommandType.ChatInput,


    run: async (client, interaction) => {
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
    }   

}