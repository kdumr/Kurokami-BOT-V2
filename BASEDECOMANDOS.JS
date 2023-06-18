const Discord = require("discord.js")

module.exports = {
    name: "Nome do comando",
    description: "Descrição do comando",
    type: Discord.ApplicationCommandType.ChatInput,
    options: [
        {
            name: "",
            description: "",
            type: Discord.ApplicationCommandOptionType,
            required: true,
        }
    ],

    run: async (client, interaction) => {
        
        
    }
}