const { ButtonBuilder } = require('discord.js');

module.exports = {
  interaction: {
    name: "slash",
    description: "Neden slash komutlarına geçildiği hakkında bilgi verir.",
    options: []
  },
  aliases: ["slash-bilgi", "slashbilgi"],
  category: "Bot",
  memberPermissions: [],
  botPermissions: ["SendMessages", "EmbedLinks", "ReadMessageHistory"],
  nsfw: false,
  cooldown: false,
  ownerOnly: false,

  async execute(client, interaction, data) {

    return interaction.reply({
      embeds: [
        {
          color: client.settings.embedColors.default,
          author: {
            name: `${client.user.username} • Slash Komutları`,
            icon_url: client.settings.icon,
          },
          fields: [
            {
              name: '**»** Slash Komut Nedir?',
              value:
                `**•** Normalde bir komut kullanırken \`${data.prefix}komutlar\` gibi kullanırsınız.\n` +
                `**•** Ancak slash komutlarında ise \`/komutlar\` yazıp oradan komutu ayrıyeten seçmeniz gerekir.`
            },
            {
              name: '**»** Neden Slash Komutlarına Geçiliyor?',
              value:
                `**•** Discord'un optimizasyon için botları slash komutlara geçirmeye zorlaması.\n` +
                `**•** Ek olarak tüm komut ayarlarının sunucu ayarlarından basitçe gerçekleştirilebilmesi.`
            },
            {
              name: '**»** Slash Komutlar Nasıl Kullanılır?',
              value:
                `**•** Herhangi bir kanalda \`/\` işaretini koyun ve kullanmak istediğiniz komutu seçin.\n` +
                `**•** Diğer komut seçenekleri otomatik olarak karşınıza gelecektir.`
            },
            {
              name: '**»** Slash Komut Kullanırken Sorun Yaşıyorum',
              value:
                `**•** İlgili sunucuda slash komut kullanmak için yetkiniz olmayabilir.\n` +
                `**•** Veya kullanmak istediğiniz komutu seçmemiş olabilirsiniz (en yaygın hata).`
            },
          ],
          /*timestamp: new Date(),
          footer: {
            text: `${(interaction.type == 2) ? interaction.user.username : interaction.author.username} tarafından istendi.`,
            icon_url: (interaction.type == 2) ? interaction.user.displayAvatarURL() : interaction.author.displayAvatarURL(),
          },*/
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
};