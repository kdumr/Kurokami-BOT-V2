require('../index')

const Discord = require('discord.js')
const client = require('../index')
const transcript = require('discord-html-transcripts')
const serverSchema = require("../Schemas/serverSchema");
const { QuickDB } = require("quick.db")
const db = new QuickDB()

async function handleTicket(interaction, category) {
    
    interaction.message.edit()
    const serverId = interaction.guild.id;
    const nome = `📨-${interaction.user.id}`;
    const filter = { serverId };
    const server = await serverSchema.findOne(filter);

    // Verifica se a categoria "TICKETS" existe no discord e no database
    if (server && server.categoryTicket !== null && server.categoryTicket !== undefined && interaction.guild.channels.cache.get(server.categoryTicket) !== undefined) {
      // Verificar se o cargo "Suporte" existe no discord e no database
      if (!server && server.roleSupID === null && server.roleSupID === undefined && interaction.guild.roles.cache.find(server.roleSupID) === undefined) {
        interaction.reply({ content: `> ❌ Ocorreu um erro ao tentar abrir o ticket!`, ephemeral: true })
        // Envia esta mensagem somente para quem tem permissão de administrador do servidor
        if(interaction.member.permissions.has(Discord.PermissionFlagsBits.Administrator)){
          interaction.followUp({ content: `> ❌ O cargo **Suporte** não existe!\n> ❗ Digite o comando \`/ticketsetup cargo\`.`, ephemeral: true })
        }
      } else{
        
        const categoryTicket = server.categoryTicket;
        console.log('Valor da categoriaTicket:', categoryTicket);
        const categoria = server.categoryTicket; // Coloque o ID da categoria
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
              topic: category,
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
                
              db.set(`autorTicket_${interaction.guild.id}_${ch.id}`, interaction.member.id)
              db.set(`idChannel_${interaction.guild.id}_${interaction.member.id}`, ch.id)
              console.log(`DB set: autorTicket_${interaction.guild.id}_${ch.id}`, interaction.member.id)
              console.log(`DB set: idChannel_${interaction.guild.id}_${interaction.member.id}`, ch.id)

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
    } else {
      await interaction.reply({ content: `> ❌ Ocorreu um erro ao tentar abrir o ticket!`, ephemeral: true})
      if(interaction.member.permissions.has(Discord.PermissionFlagsBits.Administrator)){
        interaction.followUp({ content: `> ❌ Não existe nenhuma categoria definida para armazenar os tickets!\n> ❗ Digite o comando \`/ticketsetup categoria\`.`, ephemeral: true})
      }
      console.log(`[LOG] -> [${interaction.guild.name}] O servidor não foi encontrado no banco de dados.`);
    }
    
  }
const suporte = "🗣️ Suporte"
const duvidas = "❓ Dúvidas"
const denuncias = "🚨 Denúncias"
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
            //if(interaction.member.roles.cache.has(roleSupID) || interaction.member.permissions.has(Discord.PermissionFlagsBits.ManageGuild)){
              const modalCloseTicket = new Discord.ModalBuilder()
              .setCustomId("modalCloseTicket")
              .setTitle("Fechar ticket")

              const textLabel1 = new Discord.TextInputBuilder()
              .setCustomId("textLabel1")
              .setLabel("Conclusão do ticket:")
              .setMaxLength(30)
              .setMinLength(3)
              .setPlaceholder("Digite aqui a conclusão do ticket! Exemplo: Resolvido.")
              .setRequired(true)
              .setStyle(Discord.TextInputStyle.Short)

              const textLabel2 = new Discord.TextInputBuilder()
              .setCustomId("textLabel2")
              .setLabel("Observações:")
              .setPlaceholder("Digite aqui.")
              .setRequired(false)
              .setStyle(Discord.TextInputStyle.Paragraph)

              modalCloseTicket.addComponents(
                new Discord.ActionRowBuilder().addComponents(textLabel1),
                new Discord.ActionRowBuilder().addComponents(textLabel2)
              )
              await interaction.showModal(modalCloseTicket)
          } else if (interaction.customId === "transcript_button") {
            let dbChannel = await db.get(`idChannel_${interaction.guild.id}_${interaction.member.id}`)
            const canalTranscript = dbChannel
  
            const attachment = await transcript.createTranscript(canalTranscript,
              {
                  limit: -1, // Quantidade máxima de mensagens a serem buscadas. `-1` busca recursivamente.
                  returnType: 'attachment', // Opções válidas: 'buffer' | 'string' | 'attachment' Padrão: 'attachment' OU use o enum ExportReturnType
                  filename: `${canalTranscript.name}.html`, // Válido apenas com returnType é 'attachment'. Nome do anexo.
                  saveImages: true, // Baixe todas as imagens e inclua os dados da imagem no HTML (permite a visualização da imagem mesmo depois de deletada) (! VAI AUMENTAR O TAMANHO DO ARQUIVO!)
                  footerText: 'Foram exportadas {number} mensagens!', // Altere o texto no rodapé, não se esqueça de colocar {number} para mostrar quantas mensagens foram exportadas e {s} para plural
                  poweredBy: true // Se deve incluir o rodapé "Powered by discord-html-transcripts"
              })
            interaction.user.send({ files: [attachment] })
        } 
     } else if (interaction.isModalSubmit()) {
        if (interaction.customId === "modalCloseTicket") {
          let dbAutor = await db.get(`autorTicket_${interaction.guild.id}_${interaction.channelId}`)
          let text1 = interaction.fields.getTextInputValue('textLabel1');
          let text2 = interaction.fields.getTextInputValue('textLabel2');

          let embedCloseTicket = new Discord.EmbedBuilder()
          .setTitle("✅ Ticket finalizado!")
          .addFields(
            //db.set(`autorTicket_${interaction.guild.id}_${ch.id}`, interaction.member.id)
            {
              name: "**Autor do ticket:**",
              value: `<@${dbAutor}>`,
              inline: true
            },
            {
              name: "**Categoria:**",
              value: `${interaction.channel.topic}`,
              inline: true
            },
            {
              name: "**Conclusão do ticket:**",
              value: `${text1}`,
              inline: false
            }
          )
          if (text2 != "") {
            embedCloseTicket.addFields(
              {
                name: "Observações",
                value: `${text2}`,
                inline: false
              }
              );
          }
          let sendTranscript = new Discord.ButtonBuilder()
          .setCustomId("transcript_button")
          .setLabel("📓 Transcript")
          .setStyle(Discord.ButtonStyle.Secondary);

          const rowButton = new Discord.ActionRowBuilder().addComponents(
            sendTranscript,
          );
          
          await interaction.user.send({ embeds: [embedCloseTicket], components: [rowButton]})
          interaction.reply({ content: "> ✅ Ticket finalizado!"})
          await interaction.channel.delete()
          await db.delete(`autorTicket_${interaction.guild.id}_${interaction.channelId}`)
      }
}
});