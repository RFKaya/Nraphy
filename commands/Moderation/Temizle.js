module.exports = {
  interaction: {
    name: "temizle",
    description: "Belirlediğiniz miktarda mesajı siler.",
    options: [
      {
        name: "mesaj",
        description: "Kaç adet mesajın silinmesini istiyorsun?",
        type: 4,
        required: true
      },
    ]
  },
  aliases: ["temizle", "clear", "sil"],
  category: "Moderation",
  memberPermissions: ["ManageMessages"],
  botPermissions: ["SendMessages", "EmbedLinks", "ManageMessages"],
  nsfw: false,
  cooldown: 5000,
  ownerOnly: false,

  async execute(client, interaction, data, args) {

    //------------------------------Main Kısım------------------------------//

    var mesaj;
    if (interaction.type === 2) {
      mesaj = parseInt(interaction.options.getInteger("mesaj"));
    } else {
      mesaj = parseInt(args[0]);
    }

    if (!mesaj)
      return interaction.reply({
        embeds: [
          {
            color: client.settings.embedColors.red,
            title: '**»** Bir Miktar Belirtmelisin!',
            description: `**•** Örnek kullanım: \`/temizle 15\``
          }
        ],
        ephemeral: true
      });

    if (isNaN(mesaj))
      return interaction.reply({
        embeds: [
          {
            color: client.settings.embedColors.red,
            title: '**»** Yalnızca Sayı Girmelisin!',
            description: `**•** Örnek kullanım: \`/temizle 15\``
          }
        ],
        ephemeral: true
      });


    if (mesaj <= 1)
      return interaction.reply({
        embeds: [
          {
            color: client.settings.embedColors.red,
            title: '**»** En Az 2 Mesaj Silebilirsin!',
            description: `**•** Bir mesaj sileceksen direkt silebilirsin, hiç mesaj sileceksen de...`
          }
        ],
        ephemeral: true
      }).then(msg => interaction.type !== 2 && setTimeout(() => msg.delete().catch(null), 4000));

    if (mesaj > 200)
      return interaction.reply({
        embeds: [
          {
            color: client.settings.embedColors.red,
            title: '**»** En Fazla 200 Mesaj Silebilirsin!',
            description: `**•** Discord izin vermiyor, verse dükkan senin.`
          }
        ],
        ephemeral: true
      }).then(msg => interaction.type !== 2 && setTimeout(() => msg.delete().catch(null), 4000));

    const m = mesaj + (interaction.type === 2 ? 0 : 1);

    //------------------------------Main Kısım------------------------------//

    //------------------------------Normal Temizle------------------------------//

    let embed = {
      color: client.settings.embedColors.green,
      title: `**»** Başarıyla ${mesaj} Mesaj Silindi!`,
      timestamp: new Date(),
      footer: {
        text: `${(interaction.author || interaction.user).username} tarafından silindi.`,
        icon_url: (interaction.author || interaction.user).displayAvatarURL(),
      },
    };

    try {

      //2-100
      if (m <= 100) {
        await interaction.channel.bulkDelete(m);
      }

      //101-199 arası
      if (m > 100 && !(m >= 200)) {
        interaction.channel.bulkDelete(100);
        interaction.channel.bulkDelete(m - 100);
      }

      //200
      if (m === 200 || mesaj === 200) {
        interaction.channel.bulkDelete(100);
        interaction.channel.bulkDelete(100);
      };

      return interaction.reply({ embeds: [embed] }).then(msg => {
        setTimeout(() => interaction.type === 2 ? interaction.deleteReply() : msg.delete().catch(null), 4000);
      });

    } catch (err) {

      return interaction.reply({
        embeds: [
          {
            color: client.settings.embedColors.red,
            title: '**»** Bir Hata Oluştu!',
            description:
              `**•** Bazı mesajlar silinmiş, bazıları silinememiş olabilir.\n\n` +
              `**•** 14 günden eski mesajla karşılaşılmış olabilir.\n`
          }
        ]
      });

    }

    //------------------------------Normal Temizle------------------------------//

    /*------------------------------Log Kanalına Mesaj Atması------------------------------//
      
      if (db.has(`log_${message.guild.id}`) === false) return;
    
      var kanal = message.guild.channels.get(db.fetch(`log_${message.guild.id}`));
      if (!kanal) return;
    
      const embed = new Discord.RichEmbed()
        .setColor(client.settings.embedColors.default)
        .setDescription("**»** " + message.author + " tarafından "+ message.channel + " kanalında " + m + " mesaj silindi.")
    
    kanal.send({ embeds: [embed] });
    
    //------------------------------Log Kanalına Mesaj Atması------------------------------*/

  }
};