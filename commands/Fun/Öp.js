module.exports = {
  interaction: {
    name: "öp",
    description: "İstediğiniz kişiyi öpersiniz. (NSFW gereklidir)",
    options: [
      {
        name: "kullanıcı",
        description: "Bir kullanıcı ID'si ya da etiketi gir.",
        type: 6,
        required: true
      }
    ]
  },
  interactionOnly: false,
  aliases: ["op", "sev", "öpücük", "kiss", "fuck", "sik"],
  category: "Fun",
  memberPermissions: [],
  botPermissions: ["SendMessages", "EmbedLinks"],
  nsfw: true,
  cooldown: false,
  ownerOnly: false,

  async execute(client, interaction, data) {

    var gifler = [
      "https://media.giphy.com/media/HKQZgx0FAipPO/giphy.gif",
      "https://cdn.discordapp.com/attachments/577500526749679619/580127184799268864/image0.gif",
      "https://cdn.discordapp.com/attachments/577500526749679619/580127067488911360/image0.gif",
      "https://cdn.discordapp.com/attachments/577500526749679619/580127260565307402/image0.gif",
      "https://cdn.discordapp.com/attachments/577500526749679619/580127347844448282/image0.gif",
      "https://cdn.discordapp.com/attachments/577500526749679619/580127561787506699/image0.gif",
      "https://cdn.discordapp.com/attachments/577500526749679619/580127582901633034/image0.gif",
      "https://cdn.discordapp.com/attachments/577500526749679619/580127677277667328/image0.gif",
      "https://cdn.discordapp.com/attachments/577500526749679619/580127874657550336/image0.gif",
      "https://tenor.com/view/kissing-make-up-caressing-smooching-snuggling-gif-13953470",
      "http://45.media.tumblr.com/00e6fbba41137992c38c04b4737b5c0b/tumblr_nko99t1z401uo0fjdo1_500.gif",
      "https://media0.giphy.com/media/17zrEYLzrQwgM/giphy.gif?cid=790b76115ccc8cc761596a33551818af&rid=giphy.gif",
      "https://78.media.tumblr.com/6ee2b7c64bdd13b93c9cf6abc2d16b5e/tumblr_o2nnk0G2P41ulficuo1_500.gif",
      "https://thumbs.gfycat.com/SimilarWealthyHawk-size_restricted.gif",
      "https://data.whicdn.com/images/76661628/original.gif"
    ];

    let resimler = gifler[Math.floor(Math.random() * gifler.length)];
    var kullanıcı = interaction.options?.getUser("kullanıcı") || interaction.mentions.users.first();

    if (!kullanıcı)
      return interaction.reply({
        embeds: [
          {
            color: client.settings.embedColors.red,
            title: '**»** Öpmek İstediğin Birini Etiketlemelisin!',
            description: `**•** Örnek kullanım: \`/öp @Rauqq\``
          }
        ]
      });

    if ((interaction.user || interaction.author).id === kullanıcı.id)
      return interaction.reply({
        embeds: [
          {
            color: client.settings.embedColors.red,
            title: '**»** Kendini Öpemezsin!',
            description: `**•** [Destek Sunucumuza](https://discord.gg/VppTU9h) katılırsan seni öpecek birilerini bulabilirsin 🥰`
          }
        ]
      });

    interaction.reply({
      embeds: [
        {
          color: client.settings.embedColors.default,
          description: `**»** ${kullanıcı.toString()}, seni ${(interaction.user || interaction.author).toString()} öptü! 💋💞`,
          image: {
            url: resimler,
          },
        }
      ]
    });

  }
};