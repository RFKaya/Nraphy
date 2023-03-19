const humanize = require("humanize-duration");

module.exports = {
  interaction: {
    name: "sunucu-bilgi",
    description: "Sunucunun bilgilerini verir.",
    options: [],
  },
  aliases: ['server', 'server-bilgi', 'sbilgi', 'serverbilgi', 'sunucubilgi', 'sb', "sunucu", "sv", "sw", "svinfo"],
  category: "General",
  memberPermissions: [],
  botPermissions: ["SendMessages", "EmbedLinks"],
  nsfw: false,
  cooldown: false,
  ownerOnly: false,

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

    interaction.reply({
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
                  ? `**•** ${emojis}... \n**•** \`${data.prefix}emojiler\``
                  : `**•** \`Bu sunucuda hiç emoji yok.\``,
            },
            {
              name: '**»** Uyarılar',
              value: `**•** \`${warns_warns ? `${warns_users} Kullanıcı, ${warns_warns} Uyarı` : `Bu sunucuda hiçbir kullanıcı uyarılmamış.`}\``,
            },
          ]
        }
      ]
    });

    /*var aylar = {
      "01": "Ocak",
      "02": "Şubat",
      "03": "Mart",
      "04": "Nisan",
      "05": "Mayıs",
      "06": "Haziran",
      "07": "Temmuz",
      "08": "Ağustos",
      "09": "Eylül",
      "10": "Ekim",
      "11": "Kasım",
      "12": "Aralık"
    };*/

    /*var region = {
      "us-central": "Amerika :flag_us:",
      "us-east": "Doğu Amerika :flag_us:",
      "us-south": "Güney Amerika :flag_us:",
      "us-west": "Batı Amerika :flag_us:",
      "europe": "Avrupa :flag_eu:",
      "singapore": "Singapur :flag_sg:",
      "london": "Londra :flag_gb:",
      "japan": "Japonya :flag_jp:",
      "russia": "Rusya :flag_ru:",
      "hongkong": "Hong Kong :flag_hk:",
      "brazil": "Brezilya :flag_br:",
      "singapore": "Singapur :flag_sg:",
      "sydney": "Sidney :flag_au:",
      "southafrica": "Güney Afrika :flag_za:",
      "india": "Hindistan :flag_in:"
    };
    .addField('**»** Sunucu Bölgesi', "**•** " + region[message.guild.region])*/

    //var yasaklı = await message.guild.fetchBans().then(b => b.size);

    //if (message.member.hasPermission("BanMembers")) sunucuBilgiEmbed.addField('**»** Üyeler (' + message.guild.memberCount + ')', '<:uye:729300539900428344> ' +  üye + ' Üye • <:bot:729300535433363456> ' + bot + ' Bot • <:yasakli:758361815595221012> ' + yasaklı + ' Yasaklı', true)
    //if (message.member.hasPermission("BanMembers")) return message.channel.send(sunucuBilgiEmbed)

  }
};