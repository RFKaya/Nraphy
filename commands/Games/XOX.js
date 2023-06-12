const { ButtonBuilder } = require('discord.js');

module.exports = {
  name: "xox",
  description: "XOX oynamanıza yarar.",
  usage: "xox @Kullanıcı",
  aliases: [],
  category: "Games",
  memberPermissions: [],
  botPermissions: ["SendMessages", "EmbedLinks"],
  nsfw: false,
  cooldown: 5000,
  ownerOnly: false,

  async execute(client, message, args, data) {

    this.verifyWin = (sides) => {
      return (sides[0] === sides[1] && sides[0] === sides[2])
        || (sides[0] === sides[3] && sides[0] === sides[6])
        || (sides[3] === sides[4] && sides[3] === sides[5])
        || (sides[1] === sides[4] && sides[1] === sides[7])
        || (sides[6] === sides[7] && sides[6] === sides[8])
        || (sides[2] === sides[5] && sides[2] === sides[8])
        || (sides[0] === sides[4] && sides[0] === sides[8])
        || (sides[2] === sides[4] && sides[2] === sides[6]);
    };

    const opponent = message.mentions.users.first();

    if (!opponent)
      return message.channel.send({
        embeds: [
          {
            color: client.settings.embedColors.red,
            title: '**»** Oynamak İstediğin Kişiyi Etiketlemelisin!',
            description: `**•** Örnek kullanım: \`${data.prefix}xox @RFKaya\``
          }
        ]
      });

    if (opponent.bot)
      return message.channel.send({
        embeds: [
          {
            color: client.settings.embedColors.red,
            title: '**»** Botlarla Oynayamazsın!',
            description: `**•** Botlar savunmasızdır, onlara şiddet uygulama.`
          }
        ]
      });

    if (opponent.id == client.user.id)
      return message.channel.send({
        embeds: [
          {
            color: client.settings.embedColors.red,
            title: '**»** Benimle Oynayamazsın!',
            description: `**•** Çünkü henüz benim seviyemde değilsin 😎`
          }
        ]
      });

    if (opponent.id === message.author.id)
      return message.channel.send({
        embeds: [
          {
            color: client.settings.embedColors.red,
            title: '**»** N-Ne? Kendinle mi savaşacaksın? O nasıl oluyormuş?',
            description: `**•** Kendine zarar verme canım. Hayatındaki en değerli kişi kendinsin 😚`
          }
        ]
      });

    if (client.gamesPlaying.has(message.channel.id))
      return message.channel.send({
        embeds: [
          {
            color: client.settings.embedColors.red,
            title: '**»** Bu Kanalda Devam Eden Bir Yarışma Bulunuyor!',
            description: `**•** Yarışmalarının bitmesini bekleyebilir veya farklı kanalda deneyebilirsin.`
          }
        ]
      });


    client.gamesPlaying.set(message.channel.id, this.name);

    const { buttonConfirmation } = require("../../modules/Functions");
    const buttonConfirmationResult = await buttonConfirmation(
      message,
      [
        {
          color: client.settings.embedColors.default,
          title: `**»** ${opponent.username}, XOX isteğini kabul ediyor musun?`,
          description: `**•** Butonları kullanarak cevaplayabilirsin.`
        }
      ],
      opponent.id
    );
    if (!buttonConfirmationResult.status) {

      client.gamesPlaying.delete(message.channel.id);

      return buttonConfirmationResult.reply.edit({
        embeds: [
          {
            color: client.settings.embedColors.red,
            title: '**»** Meydan Okuma Kabul Edilmedi!',
            description: `**•** Üzgünüm, istersen [destek sunucumuza](https://discord.gg/VppTU9h) katılıp orada birilerini bulabilirsin.`
          }
        ],
        components: []
      }).catch(error => { });

    }

    buttonConfirmationResult.reply.edit({
      embeds: [
        {
          color: client.settings.embedColors.green,
          description: `**»** Meydan okuma kabul edildi!`
        }
      ],
      components: []
    });

    try {

      const sides = ['0', '1', '2', '3', '4', '5', '6', '7', '8'];
      const taken = [];
      let userTurn = true;
      let winner = null;
      let drawStatus = false;
      let toplamSıraAtlama = 0;
      while (!winner && !drawStatus && taken.length < 9) {
        const user = userTurn ? message.author : opponent;
        const sign = userTurn ? 'X' : 'O';
        await message.channel.send(
          `${user}, hangi tarafı almak istersin?\n` +
          `\`\`\`\n` +
          `${sides[0]} | ${sides[1]} | ${sides[2]}\n` +
          `—————————\n` +
          `${sides[3]} | ${sides[4]} | ${sides[5]}\n` +
          `—————————\n` +
          `${sides[6]} | ${sides[7]} | ${sides[8]}\n` +
          `\`\`\``);
        const filter = res => {
          const choice = res.content;
          return res.author.id === user.id && sides.includes(choice) && !taken.includes(choice);
        };
        const turn = await message.channel.awaitMessages({ filter, max: 1, time: 15000 });
        if (!turn.size) {
          toplamSıraAtlama += 1;

          await message.channel.send({
            embeds: [
              {
                color: client.settings.embedColors.red,
                title: '**»** Süren Doldu!',
                description: `**•** Sıran rakibine geçti.`
              }
            ]
          });

          if (toplamSıraAtlama >= 4) {
            drawStatus = true;
            break;
          }

          userTurn = !userTurn;
          continue;
        }
        const choice = turn.first().content;
        sides[Number.parseInt(choice, 10)] = sign;
        taken.push(choice);
        if (this.verifyWin(sides)) winner = userTurn ? message.author : opponent;
        userTurn = !userTurn;
      }

      client.gamesPlaying.delete(message.channel.id);

      return message.channel.send({
        embeds: [
          (winner
            ? {
              color: client.settings.embedColors.green,
              title: `**»** Tebrikler ${winner.username}, kazandın! 🏆`
            }
            : {
              color: client.settings.embedColors.red,
              title: `**»** Maalesef, kimse kazanamadı.`
            }
          )
        ]
      });

    } catch (err) {
      client.gamesPlaying.delete(message.channel.id);
      throw err;
    }
  }
};