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
    });

    let webhookClient = new WebhookClient({ url: 'https://canary.discord.com/api/webhooks/864583984569909298/hfU_d1H6RR6yTHJLZ2iwGN6dprmhNSep75JHHMPbwy8G3wimmMkViNpWjDgIfYsJ0lyq' });

    const embed = {
      color: client.settings.embedColors.default,
      author: {
        name: `${interaction.user.tag} Bir Bildiri Yaptı!`,
        icon_url: interaction.user.displayAvatarURL({ dynamic: true, size: 1024 }),
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

    webhookClient/*client.guilds.cache.get(guildID).channels.cache.get(channelID)*/.send({ embeds: [embed] });
    //.then(mesaj => { mesaj.react('👍').then(mesaj.react('👎')) });

    if (interaction.guildId == "532991144112554005") {
      return interaction.editReply({
        embeds: [
          {
            color: client.settings.embedColors.green,
            title: '**»** Teşekkürler, Bildirini #Bildiriler Kanalına İlettim!',
            description: `**•** Bildirine cevabımızı görmek istersen <#716503010301444197> kanalına bakabilirsin. 👻`
          }
        ],
        components: []
      });

    } else {
      return interaction.editReply({
        embeds: [
          {
            color: client.settings.embedColors.green,
            title: '**»** Teşekkürler, Bildirini Destek Sunucuma İlettim!',
            description: `**•** Bildirine cevabımızı görmek istersen [Destek Sunucumuza](https://discord.gg/VppTU9h) katılabilirsin. 👻`
          }
        ],
        components: []
      });
    }

  }
};