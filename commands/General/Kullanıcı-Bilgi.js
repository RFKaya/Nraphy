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

    var user = interaction.type === 2
      ? interaction.options.getUser("kullanıcı") || interaction.user
      : interaction.mentions.users.first() || client.users.cache.get(args.join(" ")) || interaction.author;

    let userData = user.id === (interaction.type === 2 ? interaction.user : interaction.author).id
      ? data.user
      : await client.database.fetchUser(user.id);

    let embed = {
      color: client.settings.embedColors.default,
      author: {
        name: `${client.user.username} • Kullanıcı Bilgileri`,
        icon_url: client.settings.icon,
      },
      title: `**»** ${user.tag}`,
      thumbnail: {
        url: user.displayAvatarURL(),
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

    let member = interaction.guild.members.cache.get(user.id);
    if (member) {

      //Sunucuya Katılma Tarihi
      embed.fields.push(
        {
          name: '**»** Sunucuya Katılma Tarihi',
          value: `**•** <t:${(member.joinedAt.getTime() / 1000).toFixed(0)}:f> • \`(${humanize(Date.now() - member.joinedAt.getTime(), { language: "tr", round: true, largest: 4 })})\``,
        }
      );

      //Davetler
      embed.fields.push(
        {
          name: '**»** Davetler',
          value:
            data.guild.inviteManager.channel ?
              data.guild.inviteManager.invites?.[user.id]?.length
                ? `**•** \`${data.guild.inviteManager.invites[user.id].length} Davet\`\n` + `**•** \`/davetler\``
                : `**•** \`Bu kullanıcının hiç daveti yok.\`\n` + `**•** \`/davet-sistemi bilgi\``
              : `**•** \`Bu sunucuda davet sistemi kapalı.\`\n` + `**•** \`/davet-sistemi bilgi\``,
        }
      );

      //Uyarılar
      if (user.id === (interaction.type === 2 ? interaction.user : interaction.author).id || interaction.channel.permissionsFor(interaction.member).has("ManageMessages"))
        embed.fields.push(
          {
            name: '**»** Uyarılar',
            value:
              data.guild.warns?.[user.id]?.length
                ? `**•** \`${data.guild.warns[user.id].length} Uyarı\`\n` + `**•** \`/uyarı listele\``
                : `**•** \`Bu kullanıcının hiç uyarısı yok.\`\n` + `**•** \`/uyarı bilgi\``,
          }
        );

    } else embed.fields.push(
      {
        name: '**»** Not',
        value:
          `**•** Kullanıcı sunucuda olmadığı için aşağıdakiler gösterilemiyor.\n` +
          `**•** \`Sunucuya Katılma Tarihi, Davetler ve Uyarılar\``,
      }
    );

    //NraphyCoin
    let NC = new Intl.NumberFormat().format(userData.NraphyCoin);
    if (userData.NraphyCoin)
      embed.fields.push(
        {
          name: '**»** NraphyCoin',
          value: `**•** \`${NC} NraphyCoin\` <:NraphyCoin:946801199976419339>`,
        }
      );

    //Premium
    let Premium = userData.NraphyPremium
      ? userData.NraphyPremium > Date.now()
        ? `${humanize(userData.NraphyPremium - Date.now(), { language: "tr", round: true, largest: 2 })}`
        : "Premium'un bitmiş görünüyor :("
      : null;
    if (Premium)
      embed.fields.push(
        {
          name: '**»** Premium Süresi',
          value: `**•** \`${Premium}\``,
        }
      );

    return interaction.reply({ embeds: [embed] });

  }
};