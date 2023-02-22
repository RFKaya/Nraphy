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

    /*if (db.has(`AFK-Nick_${message.author.id}.${message.guild.id}`) == true) return; message.channel.send(new Discord.EmbedBuilder()
    .setColor(client.settings.embedColors.default)
    .setDescription(`**»** Zaten AFK'`))*/

    if (!args[0]) return message.channel.send({
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

    /*db.set(`AFK-Nick_${message.author.id}.${message.guild.id}`, message.member.displayName);
    db.set(`AFK_${message.author.id}.${message.guild.id}`, Date.now());
    db.set(`AFK-Sebep_${message.author.id}.${message.guild.id}`, sebep);*/
    data.user.AFK.reason = sebep;
    data.user.AFK.time = Date.now();
    await data.user.save();

    message.reply({
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
    });

    if (message.member.moderatable) message.guild.members.cache.get(message.author.id).setNickname(`[AFK] ${message.member.displayName}`);

  }
};