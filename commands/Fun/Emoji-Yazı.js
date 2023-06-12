module.exports = {
  interaction: {
    name: "Emojilere Çevir",
    type: 3,
  },
  aliases: ["emojiyazı", "emoji-yaz", "emojiyaz", "emojiyazdır", "emoji-yazdır", "emoji-yazı", "emojilereçevir", "emojilere-çevir", "emojiçevir", "emoji-çevir"],
  category: "Fun",
  memberPermissions: [],
  botPermissions: ["SendMessages", "EmbedLinks"],
  nsfw: false,
  cooldown: false,
  ownerOnly: false,

  async execute(client, interaction, data, args) {

    try {

      let message;
      if (interaction.type == 2) {
        message = await interaction.channel.messages.fetch(interaction.targetId);
        message = message.content;
      } else {
        message = args.join(' ');
      }

      const mapping = {
        ' ': '     ',
        ',': '     ',
        '0': ':zero:',
        '1': ':one:',
        '2': ':two:',
        '3': ':three:',
        '4': ':four:',
        '5': ':five:',
        '6': ':six:',
        '7': ':seven:',
        '8': ':eight:',
        '9': ':nine:',
        '!': ':grey_exclamation:',
        '?': ':grey_question:',
        '#': ':hash:',
        '*': ':asterisk:',
        'Ş': ':regional_indicator_s:',
        'Ğ': ':regional_indicator_g:',
        'Ü': ':regional_indicator_u:',
        'ı': ':regional_indicator_i:',
        'İ': ':regional_indicator_i:',
        'Ö': ':regional_indicator_o:',
        'Ç': ':regional_indicator_c:'
      };

      'abcdefghijklmnopqrstuvwxyz'.split('').forEach(c => {
        mapping[c] = mapping[c.toUpperCase()] = `:regional_indicator_${c}:`;
      });

      if (message.length < 1)
        return interaction.reply({
          embeds: [
            {
              color: client.settings.embedColors.red,
              title: '**»** Bir Mesaj Belirtmelisin!',
              description: `**•** Örnek kullanım: \`${data.prefix}emoji-yazı Göpürürsün Blup Blup Blup\``
            }
          ]
        });

      if (message.length > 180)
        return interaction.reply({
          embeds: [
            {
              color: client.settings.embedColors.red,
              title: '**»** Çok Uzun Bir Yazı Belirttin!',
              description: `**•** Mesajın **180** karakterden daha kısa olmalı.`
            }
          ]
        });

      let emojiYazı = message.split('').map(c => mapping[c.toUpperCase()] || c).join('').toString();

      if (!emojiYazı || !emojiYazı.length || emojiYazı.length == 0 || emojiYazı.trim().length === 0)
        return interaction.reply({
          embeds: [
            {
              color: client.settings.embedColors.red,
              title: '**»** Bir Hata Oluştu!',
              description: `**•** Sanırsam bir şeyler peşindesin. Değilsen hata benden kaynaklı.`
            }
          ]
        });

      if (emojiYazı.length > 2000)
        return interaction.reply({
          embeds: [
            {
              color: client.settings.embedColors.red,
              title: '**»** Karakter Limitini Aşmama Sebep Oluyorsun!',
              description: `**•** Benim göndereceğim mesaj **2000** karakteri geçmemeli.`
            }
          ]
        });


      interaction.reply({ content: emojiYazı });
    } catch (err) {
      interaction.reply("hata cıktı koc");
      client.logger.error(err);
    };

  }
};
