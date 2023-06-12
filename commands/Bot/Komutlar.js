const Discord = require("discord.js");

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

    let commandArgs = interaction.type === 2 ? interaction.options.getString("komut") : args.slice(0).join(" ");

    if (commandArgs) {

      let selectedCmd = client.commands.filter(command => command.category && command.category !== "Developer")
        .find(cmd => (cmd.interaction || cmd).name === commandArgs || cmd.aliases.includes(commandArgs));

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
    embedModeration.fields = embedModeration.fields.sort(function (a, b) { return b.value.split(/\r\n|\r|\n/).length - a.value.split(/\r\n|\r|\n/).length; });

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
    embedModeration.fields.unshift({
      name: '**»** Mesaj Filtreleme Sistemleri',
      value:
        `**•** Bu komutlar farklı bir sayfaya taşınmıştır.\n` +
        `**•** \`Bağlantı Engel, Büyük Harf Engel, Spam Koruması\``,
      inline: false
    });

    //Mesaj Filtreleme Sistemleri - Embed
    let embedMessageFilters = {
      color: client.settings.embedColors.default,
      author: {
        name: `${client.user.username} • Mesaj Filtreleme Sistemleri`,
        icon_url: client.settings.icon,
      },
      title: `Bir komut hakkında bilgi almak için \`/komutlar <Komut>\` yazabilirsiniz.`,
      //description: "31",
      fields: [
        ...(client.commands.filter(command => command.category === "MessageFilters").map(command => ({
          name: `**»** ${command.interaction.name.replace(/-/g, " ").toLowerCase().replace(/^[\u00C0-\u1FFF\u2C00-\uD7FF\w]|\s[\u00C0-\u1FFF\u2C00-\uD7FF\w]/g, function (letter) {
            return letter.toUpperCase();
          })}`,
          value:
            `**•** ${command.interaction.description}\n` +
            command.interaction.options.map(option => `**•** \`/${command.interaction.name} ${option.name}\``).join('\n'),
          inline: false
        }))),
        fieldsLinks
      ],
    };

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

    //Müzik Komutları
    let embedMusic = {
      color: client.settings.embedColors.default,
      author: {
        name: `${client.user.username} • Müzik Komutları`,
        icon_url: client.settings.icon,
      },
      title: `Bir komut hakkında bilgi almak için \`/komutlar <Komut>\` yazabilirsiniz.`,
      /*description: client.commands
        .filter(command => command.category == 'Music')
        .sort((a, b) => {
          console.log(a);
          if (a.interaction.name === "çal" || a.interaction.name === "ara") return -1;
          //if (a < b) return -1;
          //return 0;
        })
        .map(command => `**•** \`/${command.interaction.name}\` - ${command.interaction.description}`
          + (command.interaction.name === "ara" ? '\n' : ''))
        .join('\n'),*/
      fields: [
        {
          name: '**»** Şarkı Başlatma',
          value:
            client.commands
              .filter(command => command.category == 'Music_Player')
              .map(command => `**•** \`/${command.interaction.name}\` - ${command.interaction.description}`)
              .join('\n'),
          inline: false
        },
        {
          name: '**»** Oynatıcı Fonksiyonları',
          value:
            [
              {
                interaction: { name: "durdur - /yürüt", description: "Çalan şarkıyı duraklatır/devam ettirir.", },
                category: "Music"
              },
              ...Array.from(client.commands.filter(command => command.category == 'Music' && !['durdur', 'yürüt'].includes(command.interaction.name)), ([key, value]) => (value))
            ]
              .map(command => `**•** \`/${command.interaction.name}\` - ${command.interaction.description}`)
              .sort()
              .join('\n'),
          inline: false
        },
        fieldsLinks],
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

        `📘 • Yetkili Komutları (**${commandsModeration.length + embedModeration.fields.length - 2}**)\n` +
        `᲼᲼᲼↳ Mesaj Filtreleme Sistemleri (**${embedMessageFilters.fields.length - 1}**)\n` +
        `📙 • Eğlence Komutları (**${commandsFun.length}**)\n` +
        `📗 • Genel Komutlar (**${commandsGeneral.length}**)\n` +
        `📕 • Oyunlar (**${commandsGames.length + embedGames.fields.length - 1}**)\n` +
        `🎵 • Müzik Komutları (**${client.commands.filter(command => command.category?.startsWith('Music')).size}**)\n` +
        `🤖 • Botla İlgili Komutlar (**${commandsBot.length}**)\n\n` +

        `Hata bildirimi veya öneriler için: \`/bildiri\`\n` +
        `Bu bot [Nraphy Açık Kaynak Projesi](https://discord.gg/VppTU9h) ile oluşturulmuştur.`
        /*`${(data.user.readDateOfChanges < client.settings.updateDate) ?
          `✉️ Okunmamış yenilikler mevcut! \`/yenilikler\` yazarak okuyabilirsin!` :
          `Gelişmelerden haberdar olmak için destek sunucumuza katılabilirsiniz!`}`*/,
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
              label: '᲼᲼᲼Mesaj Filtreleme Sistemleri',
              //emoji: '📘',
              description: '᲼᲼᲼Bağlantı Engel, Spam Koruması vb.',
              value: 'messageFiltersOption',
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
    }).then(async msg => {

      const embedMaps = {
        "mainPageOption": embedMainPage,
        "moderationOption": embedModeration,
        "messageFiltersOption": embedMessageFilters,
        "funOption": embedFun,
        "generalOption": embedGeneral,
        "gamesOption": embedGames,
        "botOption": embedBot,
        "musicOption": embedMusic,
      };

      const reply = interaction.type === 2 ? await interaction.fetchReply() : msg;
      const filter = i => {
        return i.message.id === reply.id && i.deferUpdate() && i.user.id === (interaction.type === 2 ? interaction.user : interaction.author).id;
      };

      var calc = (interaction.type === 2 ? interaction.channel : msg).createMessageComponentCollector({ filter, time: 1800000 });

      calc.on('collect', async int => {

        let collectedOption = row.components[0].options.find(selectMenuOption => selectMenuOption.data.value == int.values.toString());
        row.components[0].setPlaceholder(`${collectedOption.data.emoji?.name || "📘"} ${collectedOption.data.label.replaceAll("᲼", '')}`);

        if (interaction.type === 2) {
          interaction.editReply({ embeds: [embedMaps[int.values.toString()]], components: [row] });
          //.catch(e => { });
        } else {
          msg.edit({ embeds: [embedMaps[int.values.toString()]], components: [row] });
          //.catch(e => { });
        }

      });

    });

  }
};