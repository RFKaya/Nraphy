const humanize = require("humanize-duration");

module.exports = {
  interaction: {
    name: "sunucu-bilgi",
    description: "Sunucunun bilgilerini verir.",
    options: [],
  },
  aliases: ['server', 'server-bilgi', 'sbilgi', 'serverbilgi', 'sb', "sunucu", "sv", "sw", "svinfo"],
  category: "General",
  cooldown: 10000,

  async execute(client, interaction, data) {

    var doğrulama = {
      0: "Yok",
      1: "Düşük (Discord hesapları E-posta ile doğrulanmalıdır.)",
      2: "Orta (Discord'da 5 dakikadan daha uzun bir süre kayıtlı olmalı.)",
      3: "Yüksek (Bu sunucuda 10 dakikadan daha uzun süredir üyeliği bulunmalı.)",
      4: "En Yüksek (Discord hesabında doğrulanmış bir telefonu bulunmalı.)"
    };

    var bot = interaction.guild.members.cache.filter(member => member.user.bot).size;
    var üye = (interaction.guild.memberCount - bot);
    var çevrimiçiÜyeSayısı = interaction.guild.members.cache.filter(member => !member.user.bot && member.presence?.status && member.presence.status != "offline").size;

    let emojis = interaction.guild.emojis.cache.map((e) => e).splice(0, 5).join(' ');

    //Uyarılar
    let warns_users = 0, warns_warns = 0;
    if (Object.keys(data.guild.warns || {})?.length)
      for await (let warnDataId of Object.keys(data.guild.warns || {})) {
        warns_users++;

        let warnData = data.guild.warns[warnDataId];
        if (warnData.length) warns_warns += warnData.length;
      }

    return await interaction.reply({
      embeds: [
        {
          color: client.settings.embedColors.default,
          author: {
            name: `${client.user.username} • Sunucu Bilgileri`,
            icon_url: client.settings.icon,
          },
          title: `**»** ${interaction.guild.name}`,
          thumbnail: {
            url: interaction.guild.iconURL({ size: 512 }),
          },
          fields: [
            {
              name: '**»** ID',
              value: `**•** \`${interaction.guild.id}\``,
            },
            {
              name: '**»** Sunucu Sahibi',
              value: `**•** ${client.users.cache.get(interaction.guild.ownerId).toString()}`,
            },
            {
              name: '**»** Oluşturulma Tarihi',
              value: `**•** <t:${(interaction.guild.createdAt.getTime() / 1000).toFixed(0)}:f> - \`(${humanize(Date.now() - interaction.guild.createdAt.getTime(), { language: "tr", round: true, largest: 4 })})\``,
            },
            {
              name: '**»** Doğrulama Seviyesi',
              value: `**•** \`${doğrulama[interaction.guild.verificationLevel]}\``,
            },
            {
              name: `**»** Üyeler (${interaction.guild.memberCount})`,
              value:
                `**•** <:uye:729300539900428344> **${üye}** Üye (**${çevrimiçiÜyeSayısı}** çevrimiçi)\n` +
                `**•** <:bot:729300535433363456> **${bot}** Bot`,
            },
            {
              name: '**»** Emojiler',
              value:
                emojis
                  ? `**•** ${emojis}... \n**•** \`/emojiler\``
                  : `**•** \`Bu sunucuda hiç emoji yok.\``,
            },
            {
              name: '**»** Uyarılar',
              value: `**•** \`${warns_warns ? `${warns_users} Kullanıcı, ${warns_warns} Uyarı` : `Bu sunucuda hiçbir kullanıcı uyarılmamış.`}\``,
            },
            {
              name: `**»** kanov Boost Durumu ${data.guild.NraphyBoost?.users?.length ? ":rocket:" : ""}`,
              value:
                data.guild.NraphyBoost?.users?.length
                  ? `**•** \`${data.guild.NraphyBoost?.users.map(userId => interaction.guild.members.cache.get(userId)?.user.tag || userId).join(', ')}\` tarafından güçlendiriliyor!`
                  : `**•** Bu sunucuyu kimse güçlendirmiyor. \`/boost Bilgi\``,
            },
          ]
        }
      ]
    });

  }
};