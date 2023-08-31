const fetch = require("node-fetch");

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
    name: "efekt",
    description: "Profil resminizi kullanarak efekt uygular.",
    options: [
      {
        name: "144p",
        description: "Profil resminizin kalitesini düşürür.",
        type: 1,
        options: [
          {
            name: "kullanıcı",
            description: "Bir kullanıcı ID'si ya da etiketi gir.",
            type: 6,
            required: false
          },
        ]
      },
      {
        name: "magik",
        description: "Profil resminizi abuk subuk bir şeye çevirir.",
        type: 1,
        options: [
          {
            name: "kullanıcı",
            description: "Bir kullanıcı ID'si ya da etiketi gir.",
            type: 6,
            required: false
          },
        ]
      },
      {
        name: "trigger",
        description: "Deneyerek görebilirsiniz.",
        type: 1,
        options: [
          {
            name: "kullanıcı",
            description: "Bir kullanıcı ID'si ya da etiketi gir.",
            type: 6,
            required: false
          },
        ]
      },
    ]
  },
  interactionOnly: true,
  aliases: ['blur', '144p', 'bulanıklaştır', "magic", "megik", "efek", 'triggered', 'triger', "trigger", "magik"],
  category: "Fun",
  memberPermissions: [],
  botPermissions: ["SendMessages", "EmbedLinks"],
  nsfw: false,
  cooldown: 3000,
  ownerOnly: false,

  async execute(client, interaction, data, args) {

    await interaction.deferReply();

    try {

      const user = interaction.options.getUser("kullanıcı") || interaction.user;
      const command = interaction.options.getSubcommand();

      let commandtoURL;
      if (command == "trigger") {

        const avatarURL = user.displayAvatarURL({ extension: 'png', forceStatic: true, size: 512 });
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

        return interaction.editReply({
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
        });

      }
      else if (command == "144p") commandtoURL = `https://nekobot.xyz/api/imagegen?type=jpeg&url=${user.displayAvatarURL({ extension: "png", forceStatic: true, size: 512 })}`;
      else if (command == "magik") commandtoURL = `https://nekobot.xyz/api/imagegen?type=magik&image=${user.displayAvatarURL({ extension: "png", forceStatic: true, size: 256 })}`;

      const request = await fetch(commandtoURL);
      const requestJSON = (await request.json());

      if (!request || !requestJSON?.message)
        return interaction.editReply({
          embeds: [
            {
              color: client.settings.embedColors.red,
              title: '**»** Bir Hata Oluştu!',
              description: `**•** Hatanın sebebini bilmiyorum.`
            }
          ]
        });

      return await interaction.editReply({
        embeds: [
          {
            color: client.settings.embedColors.default,
            author: {
              name: `${client.user.username} • ${command.replace('magik', "Magik")}`,
              icon_url: client.settings.icon,
            },
            image: {
              url: requestJSON.message,
            }
          }
        ]
      });

    } catch (err) {
      client.logger.error(err);
      return interaction.editReply(`Hata oluştu!`);
    };

  }
};