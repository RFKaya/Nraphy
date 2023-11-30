module.exports = {
  name: "AFK",
  description: "Deneyerek görebilirsiniz.",
  usage: "AFK",
  aliases: ["afk"],
  category: "General",
  memberPermissions: [],
  botPermissions: ["SendMessages", "EmbedLinks", "ManageNicknames"],
  nsfw: false,
  cooldown: false,
  ownerOnly: false,

  async execute(client, message, args, data) {

    if (!args[0])
      return message.reply({
        embeds: [
          {
            color: client.settings.embedColors.default,
            author: {
              name: `${client.user.username} • AFK Sistemi`,
              icon_url: client.settings.icon,
            },
            fields: [
              {
                name: '**»** AFK Sistemi Nedir?',
                value: `**•** Eğer AFK olursanız ve birisi sizi etiketlerse, neden ve ne kadar süredir AFK olduğunuza dair bilgiler verir.`,
              },
              {
                name: '**»** Nasıl AFK Olabilirim?',
                value: `**•** \`${data.prefix}afk <Sebep>\` yazarak AFK olabilirsiniz.`,
              },
              {
                name: '**»** AFK\'den Nasıl Ayrılabilirim?',
                value: `**•** AFK olduğunuz sunucuda herhangi bir kanalda, herhangi bir mesaj yazarak AFK'dan ayrılabilirsiniz.`,
              },
            ],
            image: {
              url: 'https://cdn.discordapp.com/attachments/768969206838067210/787314157597884416/unknown.png',
            },
          }
        ]
      });

    let sebep = args.slice(0).join(" ");

    if (sebep.length > 500)
      return message.reply({
        embeds: [
          {
            color: client.settings.embedColors.red,
            title: '**»** Destan mı Yazıyorsun?',
            description: '**•** Kısalt şu uyarı sebebini, beni delirtme!',
          }
        ]
      });

    data.user.AFK = { time: Date.now(), reason: sebep };
    await data.user.save();

    var messageContent = {
      embeds: [
        {
          color: client.settings.embedColors.green,
          author: {
            name: `${message.author.username}, artık AFK!`,
            icon_url: message.author.avatarURL(),
          },
          fields: [
            {
              name: '**»** Sebep',
              value: `**•** ${sebep}`,
            },
          ]
        }
      ]
    };

    if (message.member.moderatable) {
      let newNickname = `[AFK] ${message.member.displayName}`;
      if (newNickname.length > 32) {
        newNickname = newNickname.slice(0, 32);
        messageContent.embeds[0].fields.push({
          name: '**»** Bilgi',
          value: `**•** Kullanıcı adı 32 karakteri geçtiği için ufak bir kırpma uygulandı.`,
        });
      }
      message.guild.members.cache.get(message.author.id).setNickname(newNickname.slice(0, 32));
    } else {
      messageContent.embeds[0].fields.push({
        name: '**»** Bilgi',
        value: `**•** Kullanıcı adını düzenleme yetkim olmadığı için düzenleyemedim.`,
      });
    }

    await message.reply(messageContent);



  }
};