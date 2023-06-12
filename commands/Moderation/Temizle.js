const { ButtonBuilder } = require('discord.js');

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

    var mesaj = interaction.type === 2 ? parseInt(interaction.options.getInteger("mesaj")) : parseInt(args[0]);

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
      }).then(msg => interaction.type !== 2 && setTimeout(() => msg.delete().catch(e => { }), 4000));

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
      }).then(msg => interaction.type !== 2 && setTimeout(() => msg.delete().catch(e => { }), 4000));

    const m = mesaj + 1;

    //------------------------------Main Kısım------------------------------//

    //------------------------------Normal Temizle------------------------------//

    try {

      if (interaction.type === 2) await interaction.deferReply();

      let deletedMessages = 0;
      //2-100
      if (m <= 100) {
        await interaction.channel.bulkDelete(m, true).then(bulkDelete => deletedMessages += bulkDelete.size).catch(error => { });
      }

      //101-199 arası
      if (m > 100 && !(m >= 200)) {
        await interaction.channel.bulkDelete(100, true).then(bulkDelete => deletedMessages += bulkDelete.size).catch(error => { });
        await interaction.channel.bulkDelete(m - 100, true).then(bulkDelete => deletedMessages += bulkDelete.size).catch(error => { });
      }

      //200
      if (m === 200 || mesaj === 200) {
        await interaction.channel.bulkDelete(100, true).then(bulkDelete => deletedMessages += bulkDelete.size).catch(error => { });
        await interaction.channel.bulkDelete(100, true).then(bulkDelete => deletedMessages += bulkDelete.size).catch(error => { });
      }

      var embed = {
        color: client.settings.embedColors.green,
        title: `**»** Başarıyla ${deletedMessages - 1} Mesaj Silindi!`,
        timestamp: new Date(),
        footer: {
          text: `${(interaction.author || interaction.user).username} tarafından silindi.`,
          icon_url: (interaction.author || interaction.user).displayAvatarURL(),
        },
      };

      //Hiç mesaj silinemedi
      if (deletedMessages <= 1) {
        embed = {
          color: client.settings.embedColors.red,
          title: '**»** Bir Hata Oluştu!'
        };
      }

      //Bazı mesajlar silinemedi
      if (deletedMessages !== m) embed.description = `**•** **${(m - 1) - (deletedMessages - 1)}** adet mesaj, 14 günden eski olduğu için silinemedi.`;

      const reply = await (interaction.type === 2 ?
        interaction.channel.send({ embeds: [embed] })
        : interaction.reply({ embeds: [embed] }));
      setTimeout(() => reply.delete().catch(e => { }), 4000);

    } catch (err) {

      client.logger.error(err);

      let messageContent = {
        embeds: [
          {
            color: client.settings.embedColors.red,
            title: '**»** Bir Hata Oluştu!',
            description:
              `**•** Hatayla ilgili geliştirici bilgilendirildi.\n` +
              `**•** En kısa sürede çözülecektir.`
          }
        ],
        components: [
          {
            type: 1, components: [
              new ButtonBuilder().setLabel('Destek Sunucusu').setURL("https://discord.gg/VppTU9h").setStyle('Link')
            ]
          },
        ]
      };
      if (interaction.type === 2)
        return interaction.channel.send(messageContent);
      else return interaction.reply(messageContent);

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