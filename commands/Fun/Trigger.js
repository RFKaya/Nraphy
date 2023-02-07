const Discord = require("discord.js");
const { createCanvas, loadImage } = require('canvas');
const GIFEncoder = require('gifencoder');
const path = require('path');
const { streamToArray } = require('../../utils/Util.js');
const { drawImageWithTint } = require('../../utils/Canvas.js');
const coord1 = [-25, -33, -42, -14];
const coord2 = [-25, -13, -34, -10];

module.exports = {
  interaction: {
    name: "trigger",
    description: "Deneyerek görebilirsiniz.",
    options: [
      {
        name: "kullanıcı",
        description: "Bir kullanıcı ID'si ya da etiketi gir.",
        type: 6,
        required: false
      },
    ]
  },
  aliases: ['triggered', 'triger'],
  category: "Fun",
  memberPermissions: [],
  botPermissions: ["SendMessages", "EmbedLinks"],
  nsfw: false,
  cooldown: 3000,
  ownerOnly: false,

  async execute(client, interaction, data, args) {

    if (interaction.type === 2) {
      await interaction.deferReply();
      var user = interaction.options.getUser("kullanıcı") || interaction.user;
    } else {
      var user = interaction.mentions.users.first() || client.users.cache.get(args[0]) || interaction.author;
    }

    const avatarURL = user.displayAvatarURL({ extension: 'png', forceStatic: true, size: 512 });
    try {
      const base = await loadImage(path.join(__dirname, '../../', 'utils', 'triggered.png'));
      const avatar = await loadImage(avatarURL);
      const encoder = new GIFEncoder(base.width, base.width);
      const canvas = createCanvas(base.width, base.width);
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, base.width, base.width);
      const stream = encoder.createReadStream();
      encoder.start();
      encoder.setRepeat(0);
      encoder.setDelay(50);
      encoder.setQuality(200);
      for (let i = 0; i < 4; i++) {
        drawImageWithTint(ctx, avatar, 'red', coord1[i], coord2[i], 300, 300);
        ctx.drawImage(base, 0, 218, 256, 38);
        encoder.addFrame(ctx);
      }
      encoder.finish();
      const buffer = await streamToArray(stream);

      const file = new Discord.AttachmentBuilder(Buffer.concat(buffer), { name: "triggered.gif" });

      const message = {
        embeds: [
          {
            color: client.settings.embedColors.default,
            author: {
              name: `${client.user.username} • Triggered`,
              icon_url: client.settings.icon,
            },
            image: {
              url: 'attachment://triggered.gif',
            }
          }
        ],
        files: [file]
      };

      if (interaction.type === 2) {
        return interaction.editReply(message);
      } else {
        return interaction.reply(message);
      }

      //return message.channel.send({ files: [{ attachment: Buffer.concat(buffer), name: 'triggered.gif' }] });
    } catch (err) {
      if (interaction.type === 2) {
        return interaction.editReply(`Hata oluştu! \`${err.message}\`.`);
      } else {
        return interaction.reply(`Hata oluştu! \`${err.message}\`.`);
      }
    };
  }
};