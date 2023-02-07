module.exports = {
  name: "temizle",
  description: "Belirlediğiniz miktarda mesaj siler.",
  usage: "temizle <Miktar>",
  aliases: ["temizle", "clear", "sil"],
  category: "Moderation",
  memberPermissions: ["ManageMessages"],
  botPermissions: ["SendMessages", "EmbedLinks", "ManageMessages"],
  nsfw: false,
  cooldown: 5000,
  ownerOnly: false,

  async execute(client, message, args, data) {

    //------------------------------Main Kısım------------------------------//

    if (!args[0])
      return message.channel.send({
        embeds: [
          {
            color: client.settings.embedColors.red,
            title: '**»** Bir Miktar Belirtmelisin!',
            description: `**•** Örnek kullanım: \`${data.prefix}temizle <2-200>\``
          }
        ]
      });

    const mesaj = args.join(" ");
    if (isNaN(mesaj) || mesaj.includes(',') || mesaj.includes('.')) return message.channel.send({
      embeds: [
        {
          color: client.settings.embedColors.red,
          title: '**»** Yalnızca Sayı Girmelisin!',
          description: `**•** Örnek kullanım: \`${data.prefix}temizle 15\``
        }
      ]
    });

    const m = parseInt(mesaj) + 1;

    if (m > 201)
      return message.channel.send({
        embeds: [
          {
            color: client.settings.embedColors.red,
            title: '**»** En Fazla 200 Mesaj Silebilirsin!',
            description: `**•** Discord izin vermiyor, verse dükkan senin.`
          }
        ]
      })
        .then(msg => setTimeout(() => msg.delete(), 4000))
        .then(setTimeout(() => message.delete(), 4000));

    if (m < 3)
      return message.channel.send({
        embeds: [
          {
            color: client.settings.embedColors.red,
            title: '**»** En Az 2 Mesaj Silebilirsin!',
            description: `**•** Bir mesaj sileceksen direkt silebilirsin, hiç mesaj sileceksen de...`
          }
        ]
      })
        .then(msg => setTimeout(() => msg.delete(), 4000))
        .then(setTimeout(() => message.delete(), 4000));

    //------------------------------Main Kısım------------------------------//

    //------------------------------Normal Temizle------------------------------//

    let embed = {
      color: client.settings.embedColors.green,
      title: `**»** Başarıyla ${mesaj} Mesaj Silindi!`,
      timestamp: new Date(),
      footer: {
        text: `${message.author.username} tarafından silindi.`,
        icon_url: message.author.displayAvatarURL(),
      },
    };

    if (m < 101) {
      message.channel.bulkDelete(m)
        .catch(err => message.channel.send({
          embeds: [
            {
              color: client.settings.embedColors.red,
              title: '**»** Bir Hata Oluştu!',
              description: `**•** 14 günden eski mesajları silemiyorum.`
            }
          ]
        }));
      message.channel.send({ embeds: [embed] }).then(msg => setTimeout(() => msg.delete(), 4000));
    }

    if (m > 100 && m < 200) {
      message.channel.bulkDelete(100);
      message.channel.bulkDelete(m - 100)
        .catch(err => message.channel.send({
          embeds: [
            {
              color: client.settings.embedColors.red,
              title: '**»** Bir Hata Oluştu!',
              description: `**•** 14 günden eski mesajları silemiyorum.`
            }
          ]
        }));
      message.channel.send({ embeds: [embed] }).then(msg => setTimeout(() => msg.delete(), 4000));
    }

    if (mesaj == 200) {
      message.channel.bulkDelete(100);
      message.channel.bulkDelete(100)
        .catch(err => message.channel.send({
          embeds: [
            {
              color: client.settings.embedColors.red,
              title: '**»** Bir Hata Oluştu!',
              description: `**•** 14 günden eski mesajları silemiyorum.`
            }
          ]
        }));
      message.channel.send({ embeds: [embed] }).then(msg => setTimeout(() => msg.delete(), 4000));
    };

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