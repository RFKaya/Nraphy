module.exports = {
  name: "yasak-kaldır",
  description: "Belirttiğiniz kişinin banını kaldırır.",
  usage: "yasak-kaldır <ID>",
  aliases: ["unban", "un-ban", "yasakkaldır", "yasağı-kaldır", "yasağıkaldır"],
  category: "Moderation",
  memberPermissions: ["BanMembers"],
  botPermissions: ["SendMessages", "EmbedLinks", "BanMembers"],
  nsfw: false,
  cooldown: false,
  ownerOnly: false,

  async execute(client, message, args, data) {

    // No args
    if (!args[0]) {
      return message.channel.send({
        embeds: [
          {
            color: client.settings.embedColors.red,
            title: '**»** Yasağının Kaldırılmasını İstediğin Üyeyi Belirtmelisin!',
            description: `**•** Örnek kullanım: \`${data.prefix}yasağı-kaldır <ID>\``
          }
        ]
      });
    }

    //Harfli ID
    if (isNaN(args[0])) {
      return message.channel.send({
        embeds: [
          {
            color: client.settings.embedColors.red,
            title: '**»** Yasağını Kaldıracağın Üyeyi ID İle Belirtlemlisin!',
            description: `**•** Örnek kullanım: \`${data.prefix}yasağı-kaldır 700959962452459550\``
          }
        ]
      });
    }

    let user = args[0];

    //Zaten yasaklı değil.
    let ban = await message.guild.bans.fetch();
    if (!ban.get(user)) return message.channel.send({
      embeds: [
        {
          color: client.settings.embedColors.red,
          title: '**»** Yasağını Kaldırmak İstediğin Üyeyi Bulamadım!',
          description: `**•** Belirttiğin üye zaten yasaklı değil ya da hatalı ID girdin.`
        }
      ]
    });

    let member = await client.users.fetch(user);
    let banUser = await message.guild.bans.fetch(user);

    const { buttonConfirmation } = require("../../modules/Functions");
    const buttonConfirmationResult = await buttonConfirmation(
      message,
      [
        {
          color: client.settings.embedColors.default,
          author: {
            name: `${member.tag} kullanıcısının yasağını kaldırmak istiyor musun?`,
            icon_url: member.displayAvatarURL(),
          },
        }
      ]
    );

    if (!buttonConfirmationResult.status)
      return buttonConfirmationResult.reply.edit({
        embeds: [
          {
            color: client.settings.embedColors.red,
            title: '**»** Yasak Kaldırma İşlemini İptal Ettim!',
            description: `**•** Madem iptal edecektin, neden uğraştırıyorsun bizi?`
          }
        ],
        components: []
      }).catch(error => { });

    await message.guild.members.unban(member);

    return buttonConfirmationResult.reply.edit({
      embeds: [
        {
          color: client.settings.embedColors.green,
          author: {
            name: `${member.tag} kullanıcısının yasağı kaldırıldı!`,
            icon_url: member.displayAvatarURL(),
          },
          //title: '**»** Rauqq#3916 kullanıcısının yasağı kaldırıldı!',
          fields: [
            {
              name: '**»** Yasaklanma Sebebi',
              value: `**•** ${banUser.reason ? banUser.reason : "Hiçbir sebep verilmedi"}`,
            },
          ],
          timestamp: new Date(),
          footer: {
            text: `${message.author.username} tarafından kaldırıldı.`,
            icon_url: message.author.displayAvatarURL(),
          },
        }
      ],
      components: []
    });

  }
};