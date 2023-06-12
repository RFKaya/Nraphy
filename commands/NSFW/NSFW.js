const { get } = require('axios');

module.exports = {
  name: "nsfw",
  description: "NSFW",
  usage: "",
  aliases: ["sfw"],
  category: "NSFW",
  memberPermissions: [],
  botPermissions: ["SendMessages", "EmbedLinks", "AddReactions"],
  nsfw: true,
  cooldown: 1000,
  ownerOnly: false,
  voteRequired: true,

  async execute(client, interaction, args, data) {

    let nsfwContents = ["hass", "hmidriff", "pgif", "4k", "hentai", "hneko", "hkitsune", "anal", "hanal", "gonewild", "ass", "pussy", "thigh", "hthigh", "boobs", "hboobs"];
    let nsfw = args[0];

    if (!nsfw)
      return interaction.reply({
        embeds: [
          {
            color: client.settings.embedColors.red,
            title: '**»** Bir NSFW İçeriği Belirtmelisin!',
            description:
              `**•** Belirtebileceğin içerikler; \n\n` +

              `**•** \`${data.prefix}nsfw 4k\` \n` +
              `**•** \`${data.prefix}nsfw anal\` \n` +
              `**•** \`${data.prefix}nsfw ass\` \n` +
              `**•** \`${data.prefix}nsfw boobs\` \n` +
              `**•** \`${data.prefix}nsfw gonewild\` \n` +
              `**•** \`${data.prefix}nsfw pgif\` \n` +
              `**•** \`${data.prefix}nsfw pussy\` \n` +
              `**•** \`${data.prefix}nsfw thigh\` \n` +
              `**•** Hentai NSFW içerikleri: \`hass, hmidriff, hentai, hneko, hkitsune, hanal, hthigh, hboobs\` \n\n` +

              `**•** Not: Mesajının sonunda miktar belirterek tek seferde birden fazla içerik talep edebilirsin. \n\n` +

              `**•** Uyarı! NSFW komutu cinsel içerik barındırmaktadır! ⚠️`
          }
        ]
      });

    if (!nsfwContents.includes(nsfw))
      return interaction.reply({
        embeds: [
          {
            color: client.settings.embedColors.red,
            title: '**»** Hatalı Bir NSFW İçeriği Belirttin!',
            description:
              `**•** Belirtebileceğin içerikler; \n\n` +

              `**•** \`${data.prefix}nsfw 4k\` \n` +
              `**•** \`${data.prefix}nsfw anal\` \n` +
              `**•** \`${data.prefix}nsfw ass\` \n` +
              `**•** \`${data.prefix}nsfw boobs\` \n` +
              `**•** \`${data.prefix}nsfw gonewild\` \n` +
              `**•** \`${data.prefix}nsfw pgif\` \n` +
              `**•** \`${data.prefix}nsfw pussy\` \n` +
              `**•** \`${data.prefix}nsfw thigh\` \n\n` +
              `**•** Hentai NSFW içerikleri: \`hass, hmidriff, hentai, hneko, hkitsune, hanal, hthigh, hboobs\` \n\n` +

              `**•** Not: Mesajının sonunda miktar belirterek tek seferde birden fazla içerik talep edebilirsin. \n\n` +

              `**•** Uyarı! NSFW komutu cinsel içerik barındırmaktadır! ⚠️`
          }
        ]
      });

    let i = args[1] || 1;

    if (isNaN(i))
      return interaction.reply({
        embeds: [
          {
            color: client.settings.embedColors.red,
            title: '**»** Talep Edilen İçerik Miktarı Sadece Sayı Olmalı!',
            description: `**•** Örnek kullanım: \`${data.prefix}nsfw XXX 3\``
          }
        ]
      });

    if (i > 10)
      return interaction.reply({
        embeds: [
          {
            color: client.settings.embedColors.red,
            description: `**»** Tek seferde 10\'dan fazla içerik talep edemezsin!`
          }
        ]
      });

    if (i < 1)
      return interaction.reply({
        embeds: [
          {
            color: client.settings.embedColors.red,
            description: `**»** Şaka mısın?`
          }
        ]
      });

    client.userDataCache[interaction.author.id].lastCmds[this.name] = Date.now() + 500 + ((i - 1) * (data.premium ? (this.cooldown / (4 / 2)) : this.cooldown));

    if (i > 1) interaction.react('✅');

    try {

      let embeds = [];

      while (i--) {
        let res = await get(`https://nekobot.xyz/api/image?type=${nsfw.toLowerCase()}`);

        embeds.push({
          color: 0x2C2F33,
          author: {
            name: `${client.user.username} • NSFW`,
            icon_url: client.settings.icon,
          },
          //title: `**»** ${client.capitalizeFirstLetter(nsfw.toLowerCase())}`,
          image: {
            url: res.data.message,
          },
        });

      }

      interaction.reply({ embeds: embeds });

    } catch (err) {

      client.logger.error(`Command: '${this.name}' has error: ${err.message}.`);
      interaction.channel.send({
        embeds: [
          {
            color: client.settings.embedColors.red,
            title: '**»** Bir Hata Oluştu!',
            description: `**•** NSFW API'sine bağlanırken bir sorun oluştu.`
          }
        ], ephemeral: true
      });

    }

  }
};