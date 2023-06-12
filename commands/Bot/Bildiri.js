const { WebhookClient, ButtonBuilder } = require('discord.js');

module.exports = {
  interaction: {
    name: "bildiri",
    description: "Botla ilgili bildiri (Hata, öneri, şikayet vb.) yapmanızı sağlar.",
    options: [
      {
        name: "bildiri",
        description: "Bildirinizin içeriğini belirtiniz.",
        type: 3,
        required: true
      },
      {
        name: "dosya",
        description: "Bildirine bir dosya ekle (İsteğe bağlı).",
        type: 11,
        required: false
      },
    ]
  },
  interactionOnly: true,
  aliases: ["öner", 'bildir', 'bug', 'şikayet', 'öneri'],
  category: "Bot",
  memberPermissions: [],
  botPermissions: ["SendMessages", "EmbedLinks", "ReadMessageHistory"],
  nsfw: false,
  cooldown: 10000,
  ownerOnly: false,

  async execute(client, interaction, data) {

    var öneri = interaction.options.getString("bildiri");
    var dosya = interaction.options.getAttachment("dosya");

    if (öneri.length < 1) {
      return interaction.reply({
        embeds: [
          {
            color: client.settings.embedColors.red,
            title: '**»** Bir Bildiri (Öneri, Bug, Şikayet vb.) Belirtmelisin!',
            description: `**•** Örnek kullanım: \`${data.prefix}bildir <Mesaj>\``
          }
        ]
      });
    }

    if (öneri.length > 1000) {
      return interaction.reply({
        embeds: [
          {
            color: client.settings.embedColors.red,
            title: '**»** Bildiri Mesajın 1000 Karakteri Geçmemeli!',
            description: `**•** Mesajında **${öneri.length - 1000}** fazla karakter bulunuyor.`
          }
        ]
      });
    }

    const { buttonConfirmation } = require("../../modules/Functions");
    if (!await buttonConfirmation(interaction, [
      {
        color: client.settings.embedColors.default,
        title: '**»** Bildirinin Destek Sunucuma İletilmesini Onaylıyor musun?',
        description: `**•** Profilin ve ID'n ile birlikte herkese açık şekilde iletilir.`
      }
    ])) return interaction.editReply({
      embeds: [
        {
          color: client.settings.embedColors.red,
          title: '**»** Bildirini İptal Ettim!',
          description: `**•** Öyle işte iptal ettim. Madem göndermeyecektin, neden yazdın?`
        }
      ],
      components: []
    }).catch(error => { });

    let webhookClient = new WebhookClient({ url: client.config.clientLogsWebhookURL });

    const embed = {
      color: client.settings.embedColors.default,
      author: {
        name: `${interaction.user.tag} Bir Bildiri Yaptı!`,
        icon_url: interaction.user.displayAvatarURL(),
      },
      fields: [
        {
          name: '**»** Bildiri',
          value: "```" + öneri + "```",
        },
      ],
      timestamp: new Date(),
      footer: {
        text: `ID: ${interaction.user.id}`,
        icon_url: client.settings.icon,
      },
    };

    if (dosya) {
      if (dosya.name.endsWith(".jpg") || dosya.name.endsWith(".png"))
        embed.image = {
          url: dosya.url,
        };
      else embed.fields.push(
        {
          name: '**»** Dosya',
          value: `**•** [${dosya.name}](${dosya.url})`,
        }
      );
    }

    webhookClient/*client.guilds.cache.get(guildID).channels.cache.get(channelID)*/.send({ embeds: [embed] });
    //.then(mesaj => { mesaj.react('👍').then(mesaj.react('👎')) });

    if (interaction.guildId == "532991144112554005") {
      return interaction.editReply({
        embeds: [
          {
            color: client.settings.embedColors.green,
            title: '**»** Bildirin İçin Teşekkürler!',
            description: `**•** Bildirine cevabımızı görmek istersen <#716503010301444197> kanalına bakabilirsin. 👻`,
            image: {
              url: "https://media.discordapp.net/attachments/716503010301444197/1039857246705819658/Screenshot_20221109-140109_Twitter.jpg"
            }
          }
        ],
        components: []
      });

    } else {
      return interaction.editReply({
        embeds: [
          {
            color: client.settings.embedColors.green,
            title: '**»** Bildirin İçin Teşekkürler!',
            description: `**•** Bildirine cevabımızı görmek istersen [destek sunucumuza](https://discord.gg/VppTU9h) katılabilirsin. 👻`,
            image: {
              url: "https://media.discordapp.net/attachments/716503010301444197/1039857246705819658/Screenshot_20221109-140109_Twitter.jpg"
            }
          }
        ],
        components: [
          {
            data: { type: 1 }, components: [
              new ButtonBuilder().setLabel('Destek Sunucusu').setURL(`https://discord.gg/QvaDHvuYVm`).setStyle('Link')
            ]
          },
        ]
      });
    }

  }
};