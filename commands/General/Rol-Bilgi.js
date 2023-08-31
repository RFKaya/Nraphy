const humanize = require("humanize-duration");

module.exports = {
  interaction: {
    name: "rol-bilgi",
    description: "Belirlediğiniz rolün bilgilerini gösterir.",
    options: [
      {
        name: "rol",
        description: "Bir rol seç.",
        type: 8,
        required: true
      },
    ]
  },
  interactionOnly: true,
  category: "General",
  cooldown: 3000,

  async execute(client, interaction, data) {

    const role = interaction.options.getRole("rol");

    if (!role)
      return interaction.reply({
        embeds: [
          {
            color: client.settings.embedColors.red,
            title: '**»** Bir Rol Seçmelisin!',
            description:
              `**•** Bir rol seçebilir ya da ID'sini girebilirsin.\n` +
              `**•** Örnek kullanım: \`/rol-bilgi <ID/@Rol>\``
          }
        ]
      });

    return await interaction.reply({
      embeds: [
        {
          color: role.color || client.settings.embedColors.default,
          author: {
            name: `${client.user.username} • Rol Bilgileri`,
            icon_url: client.settings.icon,
          },
          title: `**»** ${role.name}`,
          fields: [
            {
              name: "**»** ID",
              value: `**•** ${role.id}`,
              inline: false,
            },
            {
              name: "**»** Sırası",
              value: `**•** Yukarıdan ${Number(interaction.guild.roles.cache.size) - Number(role.position)}; aşağıdan ${role.position}. sırada.`,
              inline: false,
            },
            {
              name: "**»** Özellikleri",
              value:
                `**•** ${role.hoist ? "Diğer üyelerden ayrı gösterilir :white_check_mark:" : "Diğer üyelerden ayrı gösterilmez :x:"}\n` +
                `**•** ${role.mentionable ? "Etiketlenebilir :white_check_mark:" : "Etiketlenemez :x:"}`,
              inline: false,
            },
            {
              name: "**»** Oluşturulma Tarihi",
              value: `**•** <t:${(role.createdAt.getTime() / 1000).toFixed(0)}:f> • \`(${humanize(Date.now() - role.createdAt.getTime(), { language: "tr", round: true, largest: 4 })})\``,
              inline: false,
            },
            {
              name: "**»** Renk",
              value: `**•** ${role.color || "Varsayılan"}`,
              inline: false,
            },
            {
              name: "**»** Rolde kaç kişi bulunuyor?",
              value: `**•** ${role.members.size}`,
              inline: false,
            },
          ]
        }
      ]
    });
  }
};