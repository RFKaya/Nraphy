const humanize = require("humanize-duration");

module.exports = {
  interaction: {
    name: "kullanıcı-bilgi",
    description: "Kullanıcı hakkında detaylı bilgi verir.",
    options: [
      {
        name: "kullanıcı",
        description: "Bir kullanıcı ID'si ya da etiketi gir.",
        type: 6,
        required: false
      },
    ]
  },
  aliases: ['kullanıcı', 'kb', 'kullanıcı-bilgi', 'k-b', 'profil', 'kullanıcıbilgi'],
  category: "General",
  memberPermissions: [],
  botPermissions: ["SendMessages", "EmbedLinks"],
  nsfw: false,
  cooldown: false,
  ownerOnly: false,

  async execute(client, interaction, data, args) {

    if (interaction.type == 2) {
      var user =
        interaction.options.getUser("kullanıcı") || interaction.user;
    } else {
      var user =
        interaction.mentions.users.first() ||
        client.users.cache.get(args.join(" ")) ||
        interaction.author;
    }

    let member = interaction.guild.members.cache.get(user.id);

    let userData = await client.database.fetchUser(user.id);

    /*let cihaz;
    if (mention.bot) {
      cihaz = "Bilinmiyor.";
    } else {
      cihaz = {
        web: "İnternet Tarayıcısı",
        desktop: "Bilgisayar",
        mobile: "Mobil"
      }[Object.keys(mention.presence.clientStatus)[0]];
    }*/

    //Premium
    let Premium = userData.NraphyPremium;
    if (Premium) {
      if (Premium < Date.now()) {
        var kalanPremiumSüresi = "Premium'un bitmiş görünüyor :(";
      } else {
        var kalanPremiumSüresi = `${humanize(Premium - Date.now(), { language: "tr", round: true, largest: 2 })}`;
      }
    };

    //NC
    let NC = new Intl.NumberFormat().format(userData.NraphyCoin);//await db.fetch(`paracık_${user.id}`);

    let embed = {
      color: client.settings.embedColors.default,
      author: {
        name: `${client.user.username} • Kullanıcı Bilgileri`,
        icon_url: client.settings.icon,
      },
      title: `**»** ${user.tag}`,
      thumbnail: {
        url: user.displayAvatarURL({ dynamic: true, size: 1024 }),
      },
      fields: [
        {
          name: '**»** ID',
          value: `**•** \`${user.id}\``,
        },
        {
          name: '**»** Oluşturulma Tarihi',
          value: `**•** <t:${(user.createdAt.getTime() / 1000).toFixed(0)}:f> • \`(${humanize(Date.now() - user.createdAt.getTime(), { language: "tr", round: true, largest: 4 })})\``,
        },
        //.addField("**»** Rolleri", /*"**•** "*/ + üye.roles.cache.filter(a => a.name !== "@everyone").map(a => a).join(" ") ? üye.roles.cache.filter(a => a.name !== "@everyone").map(a => a).join(" ") : "**•** Bu kullanıcının bu sunucuda rolü bulunmuyor.")
      ]
    };

    //if (mention.presence.status !== "offline") embed.addField("**»** Bağlandığı Cihaz", "**•** "+ sa)
    if (member) embed.fields.push(
      {
        name: '**»** Sunucuya Katılma Tarihi',
        value: `**•** <t:${(member.joinedAt.getTime() / 1000).toFixed(0)}:f> • \`(${humanize(Date.now() - member.joinedAt.getTime(), { language: "tr", round: true, largest: 4 })})\``,
      }
    );

    if (NC) embed.fields.push(
      {
        name: '**»** NraphyCoin',
        value: `**•** \`${NC} NraphyCoin\` <:NraphyCoin:946801199976419339>`,
      }
    );

    if (Premium) embed.fields.push(
      {
        name: '**»** Premium Süresi',
        value: `**•** ${!Premium ? "`Hesabına tanımlı bir Premium bulunmuyor.`" : `\`${kalanPremiumSüresi}\``}`,
      }
    );

    interaction.reply({ embeds: [embed] });

  }
};