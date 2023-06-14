const Discord = require("discord.js")

const config = require("./config.json")

const dotenv = require('dotenv')
dotenv.config()
const { TOKEN, CLIENT_ID } = process.env

const client = new Discord.Client({
    intents: [
        Discord.GatewayIntentBits.Guilds
    ]
});

module.exports = client

//Cooldown
const cooldown = new Set();
//Digite quando minutos deseja de cooldown. Exemplo: cooldown = 5 (minutos)
let cooldownTimeMin = 5;
const cooldownTime = cooldownTimeMin * 300000

client.on('interactionCreate', (interaction) => {

    if (interaction.type === Discord.InteractionType.ApplicationCommand) {

        const cmd = client.slashCommands.get(interaction.commandName);

        // Mostra um erro se o comando não existir
        if (!cmd) return interaction.reply({ content: 'Esse comando não existe!', ephemeral: true });

        interaction["member"] = interaction.guild.members.cache.get(interaction.user.id);
        
        cmd.run(client, interaction)
    }
})

client.on('ready', () => {
    
    console.log("[Kurokami] - Iniciado!")
})

client.on("interactionCreate", (interaction) => {
  roleSupID = "1118327971510497320"
  
    if (interaction.isStringSelectMenu()) {
      if (interaction.customId === "painel_ticket") {
        let opc = interaction.values[0]
        if (opc === "opc1") {
            ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
              ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
              // Nova opção
        
              let nome = `📨-${interaction.user.id}`;
              let categoria = "1117978267417325609" // Coloque o ID da categoria
        
              if (!interaction.guild.channels.cache.get(categoria)) categoria = null;
        
              if (interaction.guild.channels.cache.find(c => c.name === nome)) {
                interaction.reply({ content: `❌ Você já possui um ticket aberto em ${interaction.guild.channels.cache.find(c => c.name === nome)}!`, ephemeral: true })
              } else {
                interaction.guild.channels.create({
                name: nome,
                type: Discord.ChannelType.GuildText,
                parent: categoria,
                permissionOverwrites: [
                  {
                    id: interaction.guild.id,
                    deny: [
                      Discord.PermissionFlagsBits.ViewChannel
                    ]
                  },
                  {
                    id: interaction.user.id,
                    allow: [
                      Discord.PermissionFlagsBits.ViewChannel,
                      Discord.PermissionFlagsBits.SendMessages,
                      Discord.PermissionFlagsBits.AttachFiles,
                      Discord.PermissionFlagsBits.EmbedLinks,
                      Discord.PermissionFlagsBits.AddReactions
                    ]
                  }
                ]
              }).then( (ch) => {
                let embedSucess = new Discord.EmbedBuilder()
                .setColor("Random")
                .setDescription(`✅ | Olá ${interaction.user}, seu ticket foi aberto com sucesso!`)    
                console.log(ch.id)
                let showChannelButton = new Discord.ActionRowBuilder().addComponents(
                    new Discord.ButtonBuilder()
                    .setLabel("👁️ Visualizar atendimento")
                    .setURL(`https://discord.com/channels/${interaction.guild.id}/${ch.id}`)
                    .setStyle(Discord.ButtonStyle.Link)
                    
                  );
                interaction.reply({ embeds: [embedSucess], components: [showChannelButton], ephemeral: true })
        
                let embed = new Discord.EmbedBuilder()
                .setColor("Grey")
                .setDescription(`ℹ️ Olá ${interaction.user}, tente ser o mais breve e específico possível para que possamos te fornecer o melhor atendimento.`)
                .addFields(
                  { name: "> Categoria do atendimento:", value: "**```fix\nSuporte\n```**"}
                )
                
                let notificationButton = new Discord.ButtonBuilder()
                  .setCustomId("notification_button")
                  .setLabel("🔔 Notificar equipe")
                  .setStyle(Discord.ButtonStyle.Primary)
        
                let leaveButton = new Discord.ButtonBuilder()
                  .setCustomId("leave_button")
                  .setLabel("🚪 Sair do ticket")
                  .setStyle(Discord.ButtonStyle.Secondary)
        
                let admMenu = new Discord.ButtonBuilder()
                  .setCustomId("admmenu_button")
                  .setLabel("⚙️ Menu Administração")
                  .setStyle(Discord.ButtonStyle.Secondary)
        
                let closeButton = new Discord.ButtonBuilder()
                  .setCustomId("close_ticket")
                  .setLabel("🔒 Fechar Ticket")
                  .setStyle(Discord.ButtonStyle.Danger)
                
                const rowButton = new Discord.ActionRowBuilder()
                  .addComponents(notificationButton, leaveButton, admMenu, closeButton);
        
                ch.send({ embeds: [embed], components: [rowButton] }).then( m => { 
                  m.pin()
                 })
              })
              }
          }
          
        }

    } else if (interaction.isButton()) {
      
        if (interaction.customId === "notification_button") {
          if (cooldown.has(interaction.user.id)) {
            let notificationEmbed = new Discord.EmbedBuilder()
            .setDescription(`❌ Você precisa esperar **${cooldownTimeMin} minutos** antes de enviar uma nova notificação.`)
            .setColor("#ff0000")
            interaction.reply({ embeds: [notificationEmbed], ephemeral: true})
            
          } else {
            let notificationEmbed = new Discord.EmbedBuilder()
            .setAuthor({ name: "Notificação enviada!", iconURL: "https://i.imgur.com/hJgffT6.png"})
            .setDescription(`${interaction.user} enviou uma notificação para a equipe!`)
            .setColor("#ff8f00")
            interaction.reply({ content: `<@&${roleSupID}>`, embeds: [notificationEmbed] })
        
            //Setar Cooldown
            cooldown.add(interaction.user.id);
                setTimeout(() => {
                  // Remover usuário do cooldown após o tempo definido.
                  cooldown.delete(interaction.user.id);
                }, cooldownTime);
            }
          

        } else if (interaction.customId === "close_ticket") {
            if(interaction.member.roles.cache.has(roleSupID) || interaction.member.permissions.has(Discord.PermissionFlagsBits.ManageGuild)){
              interaction.reply(`Olá ${interaction.user}, este ticket será excluído em 5 segundos...`)
              setTimeout ( () => {
                try {
                  interaction.channel.delete()
                } catch (e) {
                  return;
                }
              }, 5000)
            } else {
              interaction.reply({ content: "❌ Você não tem permissão para fechar o ticket.", ephemeral: true})
            }
          }
            
    }
  })

client.slashCommands = new Discord.Collection()

require('./handler')(client)

client.login(TOKEN)