const humanize = require("humanize-duration");
const ms = require("ms");

module.exports = {
  interaction: {
    name: "zamanaşımı",
    description: "Belirttiğiniz kullanıcıya zamanaşımı uygularsınız.",
    options: [
      {
        name: "kullanıcı",
        description: "Bir kullanıcı ID'si ya da etiketi gir.",
        type: 6,
        required: true
      },
      {
        name: "süre",
        description: "Zamanaşımı süresini Türkçe biçimde gir. Örn: 2 saat",
        type: 3,
        required: true
      },
      {
        name: "sebep",
        description: "Zaman aşımının sebebini gir.",
        type: 3,
        required: false
      },
    ]
  },
  interactionOnly: true,
  aliases: ["timeout", "sustur", "mute", "cooldown", "zamanaşımıuygula"],
  category: "Moderation",
  memberPermissions: ["ModerateMembers"],
  botPermissions: ["SendMessages", "EmbedLinks", "ModerateMembers"],
  cooldown: 5000,

  async execute(client, interaction, data, args) {

    //Member
    const toTimeoutMember = interaction.guild.members.cache.get(interaction.options.getUser("kullanıcı").id);

    //Reason
    const reason = interaction.options.getString("sebep");

    //Duration
    const duration = interaction.options.getString("süre");
    const durationToMS = await ms(duration
      .replace(/saniye|sn|sc/gi, "s")
      .replace(/dakika|dk/gi, "m")
      .replace(/saat|sa/gi, "h")
      .replace(/gün|gü|g/gi, "d")
      .replace(/yıl|yr/gi, "y"));

    //Üye bulunamadı!
    if (!toTimeoutMember) {
      return interaction.reply({
        embeds: [
          {
            color: client.settings.embedColors.red,
            title: '**»** Zamanaşımı Uygulamak İstediğin Üyeyi Sunucuda Bulamadım!',
            fields: [
              {
                name: `**»** Sunucuda Bulunan Üye Etiketi`,
                value: `**•** \`/zamanaşımı @Rauqq\``,
              },
              {
                name: `**»** Sunucuda Bulunan Üye ID'si`,
                value: `**•** \`/zamanaşımı 700385307077509180\``,
              },
            ]
          }
        ]
      });
    }

    //Kendine zamanaşımı uygulayamazsın!
    if (toTimeoutMember.id === interaction.user.id) {
      return interaction.reply({
        embeds: [
          {
            color: client.settings.embedColors.red,
            title: '**»** Kendine Zamanaşımı Uygulayamazsın!',
            description: `**•** Yani neden mesala? Gel anlat, dertleşelim.`
          }
        ]
      });
    }

    //Bena zamanaşımı uygulayamazsın!
    if (toTimeoutMember.id === client.user.id) {
      return interaction.reply({
        embeds: [
          {
            color: client.settings.embedColors.red,
            title: '**»** Neden? Neden Ben? :sob:',
            description: `**•** Kırma beni, nolursun... Beni atma. Kıyma bana :broken_heart:`
          }
        ]
      });
    }

    //Üye, o kullanıcıya zamanaşımı uygulayabilir mi?
    if (toTimeoutMember.roles.highest.rawPosition >= interaction.member.roles.highest.rawPosition)
      return interaction.reply({
        embeds: [
          {
            color: client.settings.embedColors.red,
            title: '**»** Bu Kullanıcıya Zamanaşımı Uygulayamazsın!',
            description: `**•** Zamanaşımı için ondan daha yüksek bir role sahip olmalısın.`
          }
        ]
      });

    //Bot, o kullanıcıya zamanaşımı uygulayabilir mi?
    if (!toTimeoutMember.moderatable)
      return interaction.reply({
        embeds: [
          {
            color: client.settings.embedColors.red,
            title: '**»** Bu Kullanıcıya Zamanaşımı Uygulanamaz!',
            description:
              `**•** Üyenin **Yönetici** yetkisi olabilir.\n` +
              `**•** Üyenin benden daha üst bir rolü olabilir.`,
          }
        ]
      });

    if (!durationToMS || !(durationToMS >= 1000))
      return interaction.reply({
        embeds: [
          {
            color: client.settings.embedColors.red,
            title: `**»** Geçerli Bir Süre Belirtmelisin!`,
            description:
              `**•** Zamanaşımı süresini Türkçe biçimde belirtmelisiniz. Örnek kullanım: \`2 saat\`\n` +
              `**•** Belirtebileceğin zaman birimleri: \`Gün / saat / dakika / saniye\``,
          }
        ]
      });

    if (durationToMS > 604800000)
      return interaction.reply({
        embeds: [
          {
            color: client.settings.embedColors.red,
            title: `**»** Zamanaşımı Süresi En Fazla 7 Gün Olabilir!`,
            description: `**•** Olmadı direkt yasaklayın üyeyi. Hiç konuşamasın?`,
          }
        ]
      });

    //Timeout
    await toTimeoutMember.timeout(durationToMS, reason)
      .catch(err => {
        client.logger.error(err);

        let messageContent = {
          embeds: [
            {
              color: client.settings.embedColors.red,
              title: '**»** Bir Hata Oluştu!',
              description: `**•** Nedenini ben de bilmiyorum ki.`
            }
          ],
          components: []
        };

        return interaction.reply(messageContent).catch(error => { });
      });

    //Reply Message
    let messageContent = {
      embeds: [
        {
          color: client.settings.embedColors.green,
          author: {
            name: `${toTimeoutMember.user.username} kullanıcısına zamanaşımı uygulandı`,//'» Bir üyeye zaman aşımı uygulandı!',
            icon_url: toTimeoutMember.displayAvatarURL(),
          },
          fields: [
            {
              name: `**»** Süre`,
              value: `**•** ${humanize(durationToMS, { language: "tr" })}`,
              inline: false
            },
            {
              name: `**»** Sebep`,
              value: `**•** ${reason || "Belirtilmemiş."}`,
              inline: false
            }
          ],
          timestamp: new Date(),
          footer: {
            text: `${interaction.user.username} tarafından uygulandı.`,
            icon_url: interaction.user.displayAvatarURL(),
          },
        }
      ],
      components: []
    };

    return await interaction.reply(messageContent).catch(error => { });

  }
};