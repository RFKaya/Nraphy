const humanize = require("humanize-duration");

module.exports = {
  name: "rol-bilgi",
  description: "Belirlediğiniz rolün bilgilerini gösterir.",
  usage: "rol-bilgi <ID/@Rol/İsim>",
  aliases: ["rolbilgi"],
  category: "General",
  memberPermissions: [],
  botPermissions: ["SendMessages", "EmbedLinks"],
  nsfw: false,
  cooldown: false,
  ownerOnly: false,

  async execute(client, message, args, data) {

    var Rol = message.mentions.roles.first() || message.guild.roles.cache.find(Rol => Rol.name === args.slice().join(" ")) || message.guild.roles.cache.find(Rol => Rol.id === args[0]);

    if (!args[0]) return message.channel.send({
      embeds: [
        {
          color: client.settings.embedColors.red,
          title: '**»** Bir Rol Adı Belirtmelisin!',
          description: `**•** Bir rol etiketleyebilir, ID'sini veya adını girebilirsin.\n**•** Örnek kullanım: \`${data.prefix}rol-bilgi <ID/@Rol/İsim>\``
        }
      ]
    });

    if (!Rol) return message.channel.send({
      embeds: [
        {
          color: client.settings.embedColors.red,
          title: '**»** Böyle Bir Rol Bulunamadı!',
          description: `**•** Bir rol etiketlemeyi, rol ID'si veya adı girmeyi deneyebilirsin.`
        }
      ]
    });

    var timestamp = Date.now() - Rol.createdAt.getTime();
    var oluşturulmatarihi = humanize(timestamp, { language: "tr", round: true, largest: 4 });

    var Renk = Rol.hexColor;
    if (Rol.hexColor == "#000000") Renk = client.settings.embedColors.default;
    if (Rol.hexColor !== "#000000") Renk = Rol.color;

    var Renks = Rol.hexColor;
    if (Rol.hexColor == "#000000") Renks = "Rolün rengi bulnmuyor.";
    if (Rol.hexColor !== "#000000") Renks = Rol.hexColor + " (Hex)";

    message.channel.send({
      embeds: [{
        color: Renk,
        author: {
          name: `${client.user.username} •  Rol Bilgileri`,
          icon_url: client.settings.icon,
        },
        title: `**»** ${Rol.name}`,
        fields: [
          {
            name: "**»** ID",
            value: `**•** ${Rol.id}`,
            inline: false,
          },
          {
            name: "**»** Sırası",
            value: `**•** Yukarıdan ${Number(message.guild.roles.cache.size) - Number(Rol.position)}; aşağıdan ${Rol.position}. sırada.`,
            inline: false,
          },
          {
            name: "**»** Özellikleri",
            value: `**•** ${Rol.mentionable.toString().replace("true", "Etiketlenebilir.").replace("false", "Etiketlenemez.")}`,
            inline: false,
          },
          {
            name: "**»** Oluşturulma Tarihi",
            value: `**•** <t:${(Rol.createdAt.getTime() / 1000).toFixed(0)}:f> • (${oluşturulmatarihi})`,
            inline: false,
          },
          {
            name: "**»** Renk",
            value: `**•** ${Renks}`,
            inline: false,
          },
          {
            name: "**»** Rolde kaç kişi bulunuyor?",
            value: `**•** ${Rol.members.size}`,
            inline: false,
          },

        ]
      }]
    });
  }
};