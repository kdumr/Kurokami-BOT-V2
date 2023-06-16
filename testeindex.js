const Discord = require("discord.js")

const config = require("./config.json")
const roleSupID = config.roleSupID

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
        // Verifica se o usuário tem a permissão específica
        if (interaction.member.permissions.has(Discord.PermissionFlagsBits.Administrator)) {
          // Define a permissão do comando como true (visível)
          cmd.defaultPermission = true;
      }

        cmd.run(client, interaction)
    }
})

client.on('ready', () => {
    console.log("[Kurokami] - Iniciado!")
})
const suporte = "Suporte"
const duvidas = "Dúvidas"
const denuncias = "Denúncias"
function handleTicket(interaction, category) {
    
    interaction.message.edit()
    const nome = `📨-${interaction.user.id}`;
    const categoria = "1117978267417325609"; // Coloque o ID da categoria
  
    if (!interaction.guild.channels.cache.get(categoria)) {
      categoria = null;
    }
  
    if (interaction.guild.channels.cache.find((c) => c.name === nome)) {
      interaction.reply({
        content: `❌ Você já possui um ticket aberto em ${interaction.guild.channels.cache.find(
          (c) => c.name === nome
        )}!`,
        ephemeral: true,
      });
    } else {
      interaction.guild.channels
        .create({
          name: nome,
          type: Discord.ChannelType.GuildText,
          parent: categoria,
          permissionOverwrites: [
            {
              id: interaction.guild.id,
              deny: [
                Discord.PermissionFlagsBits.ViewChannel,
                Discord.PermissionFlagsBits.SendMessages,
                Discord.PermissionFlagsBits.AttachFiles,
                Discord.PermissionFlagsBits.EmbedLinks,
                Discord.PermissionFlagsBits.AddReactions,
              ],
            },
            {
              id: interaction.user.id,
              allow: [
                Discord.PermissionFlagsBits.ViewChannel,
                Discord.PermissionFlagsBits.SendMessages,
                Discord.PermissionFlagsBits.AttachFiles,
                Discord.PermissionFlagsBits.EmbedLinks,
                Discord.PermissionFlagsBits.AddReactions,
              ],
            },
          ],
        })
        .then((ch) => {
          let embedSucess = new Discord.EmbedBuilder()
            .setColor("Random")
            .setDescription(
              `✅ | Olá ${interaction.user}, seu ticket foi aberto com sucesso!`
            );
          console.log(ch.id);
          let showChannelButton = new Discord.ActionRowBuilder().addComponents(
            new Discord.ButtonBuilder()
              .setLabel("👁️ Visualizar atendimento")
              .setURL(`https://discord.com/channels/${interaction.guild.id}/${ch.id}`)
              .setStyle(Discord.ButtonStyle.Link)
          );
          interaction.reply({
            embeds: [embedSucess],
            components: [showChannelButton],
            ephemeral: true,
          });
  
          let embed = new Discord.EmbedBuilder()
            .setColor("#58b9ff")
            .setThumbnail("https://i.imgur.com/qqoNtND.png")
            .setTitle("Central de atendimento")
            .setDescription(`ℹ️ Olá ${interaction.user}, tente ser o mais breve e específico possível para que possamos te fornecer o melhor atendimento.`)
            .addFields(
                { name: '> **Categoria do atendimento**', value: `**\`\`\`fix\n${category}\n\`\`\`** `, inline: true },
                { name: '> **Aberto por:**', value: `${interaction.user}`, inline: true },
            )
          let notificationButton = new Discord.ButtonBuilder()
            .setCustomId("notification_button")
            .setLabel("🔔 Notificar equipe")
            .setStyle(Discord.ButtonStyle.Primary);
  
          let leaveButton = new Discord.ButtonBuilder()
            .setCustomId("leave_button")
            .setLabel("🚪 Sair do ticket")
            .setStyle(Discord.ButtonStyle.Secondary);
  
          let admMenu = new Discord.ButtonBuilder()
            .setCustomId("admmenu_button")
            .setLabel("⚙️ Menu Administração")
            .setStyle(Discord.ButtonStyle.Secondary);
  
          let closeButton = new Discord.ButtonBuilder()
            .setCustomId("close_ticket")
            .setLabel("🔒 Fechar Ticket")
            .setStyle(Discord.ButtonStyle.Danger);
  
          const rowButton = new Discord.ActionRowBuilder().addComponents(
            notificationButton,
            leaveButton,
            admMenu,
            closeButton
          );
  
          ch.send({ embeds: [embed], components: [rowButton] }).then((m) => {
            m.pin();
          });
        });
    }
  }
client.on("interactionCreate", async(interaction) => {
    if (interaction.isStringSelectMenu()) {
        if (interaction.customId === "painel_ticket") {
            let opc = interaction.values[0];
            if (opc === "suporte") {
                handleTicket(interaction, suporte);
            } else if (opc === "duvidas") {
                handleTicket(interaction, duvidas);
            }else if (opc === "denuncias") {
                handleTicket(interaction, denuncias);
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
            
          } else if (interaction.customId === "leave_button") {
            // Não deixar usuário com o cargo "roleSupID" sair do ticket
            if (interaction.member.roles.cache.some(r => r.id === roleSupID)) {
              let embedErroleave = new Discord.EmbedBuilder()
              .setDescription(`> ❌ Você não pode sair do ticket pois você tem o cargo \"<@&${roleSupID}>\" `);
              interaction.reply({ embeds: [embedErroleave], ephemeral: true })
            } else{
              let confirmButton = new Discord.ButtonBuilder()
              .setCustomId("confirm_button")
              .setLabel("Confirmar")
              .setStyle(Discord.ButtonStyle.Success)
                  
              const rowButtonconfirm = new Discord.ActionRowBuilder()
              .addComponents(confirmButton);

              let confirmEmbed = new Discord.EmbedBuilder()
              .setAuthor({ name: "Realmente deseja sair do ticket?", iconURL: "https://i.imgur.com/FChDPsO.png"})
              .setFooter({ text: "Você tem 10 segundos para confirmar!" })

              interaction.reply({ embeds: [confirmEmbed], components: [rowButtonconfirm], ephemeral: true});
              setTimeout(() => interaction.deleteReply(), 10000);
            }
            
          } else if (interaction.customId === "confirm_button") {

            let leaveEmbed = new Discord.EmbedBuilder()
            .setDescription(`${interaction.user} **__saiu__ do ticket**`)
            .setColor("#ff0000");
                  
            interaction.channel.send({ embeds: [leaveEmbed] });
            interaction.reply({ content: "Você saiu do ticket!", ephemeral: true})
            interaction.channel.permissionOverwrites.delete(interaction.member.id);

        } else if (interaction.customId === "close_ticket"){
            if(interaction.member.roles.cache.has(roleSupID) || interaction.member.permissions.has(Discord.PermissionFlagsBits.ManageGuild)){
              const modalCloseTicket = new Discord.ModalBuilder()
              .setCustomId("modalCloseTicket")
              .setTitle("Fechar ticket")

              const text1 = new Discord.TextInputBuilder()
              .setCustomId("text1")
              .setLabel("Conclusão do ticket:")
              .setMaxLength(30)
              .setMaxLength(3)
              .setPlaceholder("Digite aqui a conclusão do ticket! Exemplo: Resolvido.")
              .setRequired(true)
              .setStyle(Discord.TextInputStyle.Short)

              const text2 = new Discord.TextInputBuilder()
              .setCustomId("text2")
              .setLabel("Considerações finais:")
              .setPlaceholder("Digite aqui.")
              .setRequired(true)
              .setStyle(Discord.TextInputStyle.Paragraph)

              modalCloseTicket.addComponents(
                new Discord.ActionRowBuilder().addComponents(text1),
                new Discord.ActionRowBuilder().addComponents(text2)
              )
              await interaction.showModal(modalCloseTicket)

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
    }
);

client.slashCommands = new Discord.Collection()

require('./handler')(client)

client.login(TOKEN)