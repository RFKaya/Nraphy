let oyndurum = new Set();
const kelime = require('../../utils/Words.json');

module.exports = {
  name: "adam-asmaca",
  description: "Adam asmaca oynatır.",
  usage: "adam-asmaca",
  aliases: ["adamasmaca"],
  category: "Games",
  memberPermissions: [],
  botPermissions: ["SendMessages", "EmbedLinks"],
  nsfw: false,
  cooldown: false,
  ownerOnly: false,

  async execute(client, message, args, data) {

    if (oyndurum.has(message.channel.id)) return message.channel.send({
      embeds: [
        {
          color: client.settings.embedColors.red,
          title: '**»** Bu Kanalda Devam Eden Bir Oyun Bulunuyor!',
          description: `**•** Oyunun bitmesini bekleyebilir veya farklı kanalda deneyebilirsin.`
        }
      ]
    });

    try {
      const cevap = kelime[Math.floor(Math.random() * kelime.length)].toLocaleLowerCase('tr-TR');
      let point = 0;
      let displayText = null;
      let tahmin = false;
      const confirmation = [];
      const yanlış = [];
      const display = new Array(cevap.length).fill('_');
      while (cevap.length !== confirmation.length && point < 8) {
        await message.channel.send(
          `${displayText === null ? '**Nraphy Adam Asmaca**!' : displayText ? '**Çok iyisin!**' : '**Yanlış Harf!**'}\n` +
          `**Kelime:**    \`${display.join(' ')}\`\n` +
          `**Yanlış Harfler:** ${yanlış.join(', ') || 'Yok'}\n` +
          `\`\`\`\n` +
          `___________\n` +
          `|     |\n` +
          `|     ${point > 0 ? '😵' : ''}\n` +
          `|    ${point > 3 ? '┌' : ' '}${point > 1 ? '(' : ''}${point > 2 ? ')' : ' '}${point > 4 ? '┐' : ''}\n` +
          `|     ${point > 5 ? '/' : ''}${point > 6 ? '\\' : ''}\n` +
          `|\n` +
          `\`\`\``);
        const filter = res => {
          const choice = res.content.toLocaleLowerCase('tr-TR');
          return res.author.id === message.author.id && !confirmation.includes(choice) && !yanlış.includes(choice);
        };
        const guess = await message.channel.awaitMessages({ filter, max: 1, time: 20000 });
        if (!guess.size) {
          await message.channel.send({
            embeds: [
              {
                color: client.settings.embedColors.red,
                description: `**»** Üzgünüm, süren doldu.`
              }
            ]
          });
          break;
        }
        const choice = guess.first().content.toLocaleLowerCase('tr-TR');
        if (choice === 'end') break;
        if (choice.length > 1 && choice === cevap) {
          tahmin = true;
          break;
        } else if (cevap.includes(choice)) {
          displayText = true;
          for (let i = 0; i < cevap.length; i++) {
            if (cevap.charAt(i) !== choice) continue;
            confirmation.push(cevap.charAt(i));
            display[i] = cevap.charAt(i);
          }
        } else {
          displayText = false;
          if (choice.length === 1) yanlış.push(choice);
          point++;
        }
      }
      oyndurum.delete(message.channel.id);
      if (cevap.length === confirmation.length || tahmin) return message.channel.send({
        embeds: [
          {
            color: client.settings.embedColors.green,
            title: `**»** Tebrikler Kelimeyi Buldun! 🏆`,
            description: `**•** ${client.capitalizeFirstLetter(cevap, "tr")}`
          }
        ]
      });
      return message.channel.send({
        embeds: [
          {
            color: client.settings.embedColors.red,
            title: `**»** Maalesef Bilemedin!`,
            description: `**•** Tahmin edemediğin kelime: **${client.capitalizeFirstLetter(cevap, "tr")}**`
          }
        ]
      });
    } catch (err) {
      oyndurum.delete(message.channel.id);
      return message.channel.send({
        embeds: [
          {
            color: client.settings.embedColors.red,
            title: `**»** Bir Hata Oluştu!`,
            description: `\`\`\`${err.message}\`\`\``
          }
        ]
      });
    }
  }
};