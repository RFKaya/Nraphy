const Discord = require("discord.js");
const { MessageActionRow, ButtonBuilder } = require('discord.js');

module.exports = {
  interaction: {
    name: "komutlar",
    description: "Tüm komutları, kategorileriyle birlikte listeler.",
    options: [
      {
        name: "komut",
        description: "Belirttiğiniz komut hakkında bilgi verir.",
        type: 3,
        required: false
      },
    ]
  },
  aliases: ['h', 'help', 'y', 'yardım', 'yardim', 'komut', 'commands', 'cmds'],
  category: "Bot",
  memberPermissions: [],
  botPermissions: ["SendMessages", "EmbedLinks", "ReadMessageHistory"],
  nsfw: false,
  cooldown: 10000,
  ownerOnly: false,

  async execute(client, interaction, data, args) {

    //------------------------------KOMUT BİLGİ------------------------------//

    if (interaction.type === 2) {

      var userData = await client.database.fetchUser(interaction.user.id);
      var commandArgs = interaction.options.getString("komut");

    } else {

      var userData = await client.database.fetchUser(interaction.author.id);
      var commandArgs = args.slice(0).join(" ");

    }

    if (commandArgs) {

      var selectedCmd;

      client.commands.forEach(cmd => {
        if ((cmd.interaction && cmd.interaction.name == commandArgs) || (cmd.name && cmd.name == commandArgs)) {
          selectedCmd = cmd;

        } else if (cmd.aliases && cmd.aliases.includes(commandArgs)) {
          selectedCmd = cmd;

        }
      });

      if (selectedCmd) {

        return interaction.reply({
          embeds: [
            {
              color: client.settings.embedColors.default,
              //title: '**»** Botun davet bağlantısına ulaşmak için buraya tıkla!',
              author: {
                name: `${client.user.username} • Komut Bilgisi`,
                icon_url: client.settings.icon,
              },
              fields: [
                {
                  name: '**»** Komut',
                  value: `**•** ${client.capitalizeFirstLetter(selectedCmd.interaction ? selectedCmd.interaction.name : selectedCmd.name, "tr")}`,
                },
                {
                  name: '**»** Açıklama',
                  value: `**•** ${selectedCmd.interaction ? selectedCmd.interaction.description : selectedCmd.description}`,
                },
                {
                  name: '**»** Kategori',
                  value: `**•** ${selectedCmd.category}`,
                },
              ],
            }
          ],
        });

      } else {

        return interaction.reply({
          embeds: [
            {
              color: client.settings.embedColors.red,
              title: "**»** Komut Bulunamadı!",
              description: `**•** Tüm komutları görmek için \`/komutlar\` yazabilirsin.`
            }
          ],
        });

      }

    }

    //------------------------------KOMUT BİLGİ------------------------------//

    //------------------------------Back End------------------------------//

    //Yetkili Komutları - Back End
    let embedModeration = { fields: [] };
    let commandsModeration = [];
    await client.commands.forEach(command => {
      if (command.category == 'Moderation') {
        if (!command.interaction) {
          commandsModeration.push(`**•** \`${data.prefix}${command.name}\` - ${command.description}\n`);
        } else {
          if (command.interaction.type && command.interaction.type == 3) {
            commandsModeration.push(`**•** \`${command.interaction.name}\` - (Uygulama)\n`);
          } else if ((command.interaction.options && command.interaction.options.length > 0) && (command.interaction.options[0].type == 1 || command.interaction.options[0].type == 2)) {
            let options = [];
            command.interaction.options.forEach(subCommand => {
              options.push(`**•** \`/${command.interaction.name + " " + subCommand.name}\``);
            });
            //embedModeration.fields.push(`**»** ${client.capitalizeFirstLetter(command.interaction.name, "tr")}`, options.join('\n'), true);
            embedModeration.fields.push({
              name:
                `**»** ${command.interaction.name.replace(/-/g, " ").toLowerCase().replace(/^[\u00C0-\u1FFF\u2C00-\uD7FF\w]|\s[\u00C0-\u1FFF\u2C00-\uD7FF\w]/g, function (letter) {
                  return letter.toUpperCase();
                })}`,
              value: options.join('\n'),
              inline: true
            });
          } else {
            commandsModeration.push(`**•** \`/${command.interaction.name}\` - ${command.interaction.description}\n`);
          }
        }
      }
    });

    //Eğlence Komutları - Back End
    let commandsFun = [];
    client.commands.forEach(command => {
      if (command.category == 'Fun') {
        if (!command.interaction) {
          commandsFun.push(`**•** \`${data.prefix}${command.name}\` - ${command.description}\n`);
        } else {
          if (command.interaction.type && command.interaction.type == 3) {
            commandsFun.push(`**•** \`${command.interaction.name}\` - (Uygulama)\n`);
          } else if ((command.interaction.options && command.interaction.options.length > 0) && (command.interaction.options[0].type == 1 || command.interaction.options[0].type == 2)) {
            command.interaction.options.forEach(subCommand => {
              commandsFun.push(`**•** \`/${command.interaction.name + " " + subCommand.name}\` - ${subCommand.description}\n`);
            });
          } else {
            commandsFun.push(`**•** \`/${command.interaction.name}\` - ${command.interaction.description}\n`);
          }
        }
      }
    });

    //Genel Komutlar - Back End
    let commandsGeneral = [];
    client.commands.forEach(command => {
      if (command.category == 'General') {
        if (!command.interaction) {
          commandsGeneral.push(`**•** \`${data.prefix}${command.name}\` - ${command.description}\n`);
        } else {
          if (command.interaction.type && command.interaction.type == 3) {
            commandsGeneral.push(`**•** \`${command.interaction.name}\` - (Uygulama)\n`);
          } else if ((command.interaction.options && command.interaction.options.length > 0) && (command.interaction.options[0].type == 1 || command.interaction.options[0].type == 2)) {
            command.interaction.options.forEach(subCommand => {
              commandsGeneral.push(`**•** \`/${command.interaction.name + " " + subCommand.name}\` - ${subCommand.description}\n`);
            });
          } else {
            commandsGeneral.push(`**•** \`/${command.interaction.name}\` - ${command.interaction.description}\n`);
          }
        }
      }
    });

    //Oyunlar - Back End
    let embedGames = { fields: [] };
    let commandsGames = [];
    await client.commands.forEach(command => {
      if (command.category == 'Games') {
        if (!command.interaction) {
          commandsGames.push(`**•** \`${data.prefix}${command.name}\` - ${command.description}\n`);
        } else {
          if (command.interaction.type && command.interaction.type == 3) {
            commandsGames.push(`**•** \`${command.interaction.name}\` - (Uygulama)\n`);
          } else if ((command.interaction.options && command.interaction.options.length > 0) && (command.interaction.options[0].type == 1 || command.interaction.options[0].type == 2)) {
            let options = [];
            command.interaction.options.forEach(subCommand => {
              options.push(`**•** \`/${command.interaction.name + " " + subCommand.name}\``);
            });
            //embedGames.fields.push(`**»** ${client.capitalizeFirstLetter(command.interaction.name, "tr")}`, options.join('\n'), true);
            embedGames.fields.push({
              name:
                `**»** ${command.interaction.name.replace(/-/g, " ").toLowerCase().replace(/^[\u00C0-\u1FFF\u2C00-\uD7FF\w]|\s[\u00C0-\u1FFF\u2C00-\uD7FF\w]/g, function (letter) {
                  return letter.toUpperCase();
                })}`,
              value: options.join('\n'),
              inline: true
            });
          } else {
            commandsGames.push(`**•** \`/${command.interaction.name}\` - ${command.interaction.description}\n`);
          }
        }
      }
    });
    /*let commandsGames = [];
    client.commands.forEach(command => {
      if (command.category == 'Games') {
        if (!command.interaction) {
          commandsGames.push(`**•** \`${data.prefix}${command.name}\` - ${command.description}\n`);
        } else {
          if (command.interaction.type && command.interaction.type == 3) {
            commandsGames.push(`**•** \`${command.interaction.name}\` - (Uygulama)\n`);
          } else if ((command.interaction.options && command.interaction.options.length > 0) && (command.interaction.options[0].type == 1 || command.interaction.options[0]?.type == 2)) {
            command.interaction.options.forEach(subCommand => {
              commandsGames.push(`**•** \`/${command.interaction.name + " " + subCommand.name}\` - ${subCommand.description}\n`);
            });
          } else {
            commandsGames.push(`**•** \`/${command.interaction.name}\` - ${command.interaction.description}\n`);
          }
        }
      }
    });*/

    //Müzik Komutları - Back End
    let commandsMusic = [];
    client.commands.forEach(command => {
      if (command.category == 'Music') {
        if (!command.interaction) {
          commandsMusic.push(`**•** \`${data.prefix}${command.name}\` - ${command.description}\n`);
        } else {
          if (command.interaction.type && command.interaction.type == 3) {
            commandsMusic.push(`**•** \`${command.interaction.name}\` - (Uygulama)\n`);
          } else if ((command.interaction.options && command.interaction.options.length > 0) && (command.interaction.options[0].type == 1 || command.interaction.options[0].type == 2)) {
            command.interaction.options.forEach(subCommand => {
              commandsMusic.push(`**•** \`/${command.interaction.name + " " + subCommand.name}\` - ${subCommand.description}\n`);
            });
          } else {
            commandsMusic.push(`**•** \`/${command.interaction.name}\` - ${command.interaction.description}\n`);
          }
        }
      }
    });

    //Çekiliş Komutları - Back End
    let commandsGiveaway = [];
    client.commands.forEach(command => {
      if (command.category == 'Giveaway') {
        if (!command.interaction) {
          commandsGiveaway.push(`**•** \`${data.prefix}${command.name}\` - ${command.description}\n`);
        } else {
          if (command.interaction.type && command.interaction.type == 3) {
            commandsGiveaway.push(`**•** \`${command.interaction.name}\` - (Uygulama)\n`);
          } else if ((command.interaction.options && command.interaction.options.length > 0) && (command.interaction.options[0].type == 1 || command.interaction.options[0]?.type == 2)) {
            command.interaction.options.forEach(subCommand => {
              commandsGiveaway.push(`**•** \`/${command.interaction.name + " " + subCommand.name}\` - ${subCommand.description}\n`);
            });
          } else {
            commandsGiveaway.push(`**•** \`/${command.interaction.name}\` - ${command.interaction.description}\n`);
          }
        }
      }
    });

    //NraphyCoin - Back End
    let commandsNC = [];
    client.commands.forEach(command => {
      if (command.category == 'NC') {
        if (!command.interaction) {
          commandsNC.push(`**•** \`${data.prefix}${command.name}\` - ${command.description}\n`);
        } else {
          if (command.interaction.type && command.interaction.type == 3) {
            commandsNC.push(`**•** \`${command.interaction.name}\` - (Uygulama)\n`);
          } else {
            //Manuel Düzenleme Yapılmıştır (Diğerlerinden Farklıdır)
            commandsNC.push(`**•** \`/${command.interaction.name}\` - ${command.interaction.description}\n`);
          }
        }
      }
    });

    //Botla İlgili Komutlar - Back End
    let commandsBot = [];
    client.commands.forEach(command => {
      if (command.category == 'Bot') {
        if (!command.interaction) {
          commandsBot.push(`**•** \`${data.prefix}${command.name}\` - ${command.description}\n`);
        } else {
          if (command.interaction.type && command.interaction.type == 3) {
            commandsBot.push(`**•** \`${command.interaction.name}\` - (Uygulama)\n`);
          } else if ((command.interaction.options && command.interaction.options.length > 0) && (command.interaction.options[0].type == 1 || command.interaction.options[0].type == 2)) {
            command.interaction.options.forEach(subCommand => {
              commandsBot.push(`**•** \`/${command.interaction.name + " " + subCommand.name}\` - ${subCommand.description}\n`);
            });
          } else {
            commandsBot.push(`**•** \`/${command.interaction.name}\` - ${command.interaction.description}\n`);
          }
        }
      }
    });

    //------------------------------Back End------------------------------//

    //------------------------------Embeds------------------------------//

    let fieldsLinks = {
      name: '**»** Bağlantılar',
      value: `**•** [Destek Sunucusu](https://discord.gg/VppTU9h) • [Davet Bağlantısı](${client.settings.invite})`,
      inline: false
    };

    //Yetkili Komutları - Embed
    embedModeration.color = client.settings.embedColors.default;
    embedModeration.author = {
      name: `${client.user.username} • Yetkili Komutları`,
      icon_url: client.settings.icon,
    };
    embedModeration.title = `Bir komut hakkında bilgi almak için \`/komutlar <Komut>\` yazabilirsiniz.`;
    embedModeration.description = commandsModeration.join('');
    embedModeration.fields.push(fieldsLinks);

    //Eğlence Komutları - Embed
    let embedFun = {
      color: client.settings.embedColors.default,
      author: {
        name: `${client.user.username} • Eğlence Komutları`,
        icon_url: client.settings.icon,
      },
      title: `Bir komut hakkında bilgi almak için \`/komutlar <Komut>\` yazabilirsiniz.`,
      description: commandsFun.join(''),
      fields: [fieldsLinks],
    };

    //Genel Komutlar - Embed
    let embedGeneral = {
      color: client.settings.embedColors.default,
      author: {
        name: `${client.user.username} • Genel Komutlar`,
        icon_url: client.settings.icon,
      },
      title: `Bir komut hakkında bilgi almak için \`/komutlar <Komut>\` yazabilirsiniz.`,
      description: commandsGeneral.join(''),
      fields: [fieldsLinks],
    };

    //Oyunlar - Embed
    embedGames.color = client.settings.embedColors.default;
    embedGames.author = {
      name: `${client.user.username} • Oyunlar`,
      icon_url: client.settings.icon,
    };
    embedGames.title = `Bir komut hakkında bilgi almak için \`/komutlar <Komut>\` yazabilirsiniz.`;
    embedGames.description = commandsGames.join('');
    embedGames.fields.push(fieldsLinks);
    /*let embedGames = {
      color: client.settings.embedColors.default,
      author: {
        name: `${client.user.username} • Oyunlar`,
        icon_url: client.settings.icon,
      },
      title: `Bir komut hakkında bilgi almak için \`/komutlar <Komut>\` yazabilirsiniz.`,
      description: commandsGames.join(''),
      fields: [fieldsLinks],
    };*/

    //Müzik Komutları - Embed
    let embedMusic = {
      color: client.settings.embedColors.default,
      author: {
        name: `${client.user.username} • Müzik Komutları`,
        icon_url: client.settings.icon,
      },
      title: `Bir komut hakkında bilgi almak için \`/komutlar <Komut>\` yazabilirsiniz.`,
      description: commandsMusic.join(''),
      fields: [fieldsLinks],
    };

    //Çekiliş - Embed
    let embedGiveaway = {
      color: client.settings.embedColors.default,
      author: {
        name: `${client.user.username} • Çekiliş`,
        icon_url: client.settings.icon,
      },
      title: `Bir komut hakkında bilgi almak için \`/komutlar <Komut>\` yazabilirsiniz.`,
      description: commandsGiveaway.join(''),
      fields: [fieldsLinks],
    };

    //NraphyCoin - Embed
    let embedNC = {
      color: client.settings.embedColors.default,
      author: {
        name: `${client.user.username} • NraphyCoin`,
        icon_url: client.settings.icon,
      },
      title: `Bir komut hakkında bilgi almak için \`/komutlar <Komut>\` yazabilirsiniz.`,
      description: commandsNC.join(''),
      fields: [fieldsLinks],
    };

    //Botla İlgili Komutlar - Embed
    let embedBot = {
      color: client.settings.embedColors.default,
      author: {
        name: `${client.user.username} • Botla İlgili Komutlar`,
        icon_url: client.settings.icon,
      },
      title: `Bir komut hakkında bilgi almak için \`/komutlar <Komut>\` yazabilirsiniz.`,
      description: commandsBot.join(''),
      fields: [fieldsLinks],
    };

    //Ana Sayfa - Embed
    const embedMainPage = {
      color: client.settings.embedColors.default,
      title: `Bir komut hakkında bilgi almak için \`/komutlar <Komut>\` yazabilirsiniz.`,
      author: {
        name: `${client.user.username} • Komutlar`,
        icon_url: client.settings.icon
      },
      description:
        `Aşağıdaki menüden istediğiniz kategorinin komutlarına ulaşabilirsiniz.\n\n` +

        `📚 • Ana Sayfa\n\n` +

        `📘 • Yetkili Komutları (**${commandsModeration.length + embedModeration.fields.length - 1}**)\n` +
        `📙 • Eğlence Komutları (**${commandsFun.length}**)\n` +
        `📗 • Genel Komutlar (**${commandsGeneral.length}**)\n` +
        `📕 • Oyunlar (**${commandsGames.length + embedGames.fields.length - 1}**)\n` +
        `🎵 • Müzik Komutları (**${commandsMusic.length}**)\n` +
        //`🎉 • Çekiliş (**${commandsGiveaway.length}**)\n` +
        //`💰 • NraphyCoin (**${commandsNC.length}**)\n` +
        `🤖 • Botla İlgili Komutlar (**${commandsBot.length}**)\n\n` +

        `Hata bildirimi veya öneriler için: \`/bildiri\`\n` +
        `**[YENİ!]** Kampanya Haber Sistemi: \`/kampanya-haber Bilgi\``,
      fields: [fieldsLinks],
    };

    //Row
    const row = new Discord.ActionRowBuilder()
      .addComponents(
        new Discord.StringSelectMenuBuilder()
          .setCustomId('select')
          .setPlaceholder('Buradan kategori seçebilirsin')
          .addOptions([
            {
              label: 'Ana Sayfa',
              emoji: '📚',
              description: 'Komutların kategorilerini listeleyen sayfa.',
              value: 'mainPageOption',
            },
            {
              label: 'Yetkili Komutları',
              emoji: '📘',
              description: 'Sunucuyla ilgili yönetim komutları.',
              value: 'moderationOption',
            },
            {
              label: 'Eğlence Komutları',
              emoji: '📙',
              description: 'Espri, Aşk-Ölçer, Konuştur, 144p gibi eğlenceli komutlar.',
              value: 'funOption',
            },
            {
              label: 'Genel Komutları',
              emoji: '📗',
              description: 'İşinize yarayabilecek komutlar.',
              value: 'generalOption',
            },
            {
              label: 'Oyunlar',
              emoji: '📕',
              description: 'Düello, XOX, Yazı-Tura, Kelime-Yarışması gibi oyunlar.',
              value: 'gamesOption',
            },
            {
              label: 'Müzik Komutları',
              emoji: '🎵',
              //description: 'Müzik çalmanıza yarayan komutlar.',
              value: 'musicOption',
            },
            /*{
              label: 'Çekiliş Komutları',
              emoji: '🎉',
              //description: 'Çekiliş yapmanıza yarayan komutlar.',
              value: 'giveawayOption',
            },*/
            /*{
              label: 'NraphyCoin Komutları',
              emoji: '💰',
              //description: 'NraphyCoin ile ilgili tüm komutlar.',
              value: 'NCOption',
            },*/
            {
              label: 'Bot Komutları',
              emoji: '🤖',
              description: 'Nraphy ile ilgili komutlar.',
              value: 'botOption',
            },
          ])
      );

    //------------------------------Embeds------------------------------//

    //------------------------------Sending Embed & Select Menu------------------------------//

    interaction.reply({
      embeds: [embedMainPage],
      components: [row]
    }).then(msg => {

      if (interaction.type === 2) {

        (async () => {
          const reply = await interaction.fetchReply();
          const filter = i => {
            i.deferUpdate();
            return i.user.id === interaction.user.id && i.message.id === reply.id;
          };
          var calc = interaction.channel.createMessageComponentCollector({ filter, time: 1800000 });

          calc.on('collect', async int => {

            let collectedOption = row.components[0].options.find(selectMenuOption => selectMenuOption.data.value == int.values.toString());
            row.components[0].setPlaceholder(`${collectedOption.data.emoji.name} ${collectedOption.data.label}`);

            if (int.values.toString() === "mainPageOption") {
              interaction.editReply({ embeds: [embedMainPage], components: [row] });

            } else if (int.values.toString() === "moderationOption") {
              interaction.editReply({ embeds: [embedModeration], components: [row] });

            } else if (int.values.toString() === "funOption") {
              interaction.editReply({ embeds: [embedFun], components: [row] });

            } else if (int.values.toString() === "generalOption") {
              interaction.editReply({ embeds: [embedGeneral], components: [row] });

            } else if (int.values.toString() === "gamesOption") {
              interaction.editReply({ embeds: [embedGames], components: [row] });

            } else if (int.values.toString() === "NCOption") {
              interaction.editReply({ embeds: [embedNC], components: [row] });

            } else if (int.values.toString() === "botOption") {
              interaction.editReply({ embeds: [embedBot], components: [row] });

            } else if (int.values.toString() === "musicOption") {
              interaction.editReply({ embeds: [embedMusic], components: [row] });

            } else if (int.values.toString() === "giveawayOption") {
              interaction.editReply({ embeds: [embedGiveaway], components: [row] });

            }
          });
        })();

      } else {

        const filter = i => {
          i.deferUpdate();
          return i.user.id === interaction.author.id;
        };
        var calc = msg.createMessageComponentCollector({ filter, time: 1800000 });

        calc.on('collect', async int => {

          let collectedOption = row.components[0].options.find(selectMenuOption => selectMenuOption.data.value == int.values.toString());
          row.components[0].setPlaceholder(`${collectedOption.data.emoji.name} ${collectedOption.data.label}`);

          if (int.values.toString() === "mainPageOption") {
            msg.edit({ embeds: [embedMainPage], components: [row] });

          } else if (int.values.toString() === "moderationOption") {
            msg.edit({ embeds: [embedModeration], components: [row] });

          } else if (int.values.toString() === "funOption") {
            msg.edit({ embeds: [embedFun], components: [row] });

          } else if (int.values.toString() === "generalOption") {
            msg.edit({ embeds: [embedGeneral], components: [row] });

          } else if (int.values.toString() === "gamesOption") {
            msg.edit({ embeds: [embedGames], components: [row] });

          } else if (int.values.toString() === "NCOption") {
            msg.edit({ embeds: [embedNC], components: [row] });

          } else if (int.values.toString() === "botOption") {
            msg.edit({ embeds: [embedBot], components: [row] });

          } else if (int.values.toString() === "musicOption") {
            msg.edit({ embeds: [embedMusic], components: [row] });

          } else if (int.values.toString() === "giveawayOption") {
            msg.edit({ embeds: [embedGiveaway], components: [row] });

          }
        });
      }

    });

  }
};