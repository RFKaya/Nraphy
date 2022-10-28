const { Permissions, ButtonBuilder } = require('discord.js');

module.exports = {
  interaction: {
    name: "kilit",
    description: "Kanala üyelerin mesaj yazmasını kilitler/kilidini açar.",
    options: [
      {
        name: "kilitle",
        description: "Kanalı kilitleyerek üyelerin mesaj yazmasını kısıtlar.",
        type: 1,
        options: []
      },
      {
        name: "kaldır",
        description: "Kilidi kaldırarak kanala mesaj yazılmasına izin verir.",
        type: 1,
        options: []
      },
    ]
  },
  interactionOnly: true,
  aliases: ["lock", " unlock", "kilit-aç", "kilitaç", "kanal-kilit", "kanalkilit", "kilitle"],
  category: "Moderation",
  memberPermissions: ["ManageChannels"],
  botPermissions: ["SendMessages", "EmbedLinks", "ManageChannels"],
  nsfw: false,
  cooldown: false,
  ownerOnly: false,

  async execute(client, interaction, data) {
    const getCommand = interaction.options.getSubcommand();

    const destekSunucusuButton = new ButtonBuilder().setLabel('Destek Sunucusu').setURL("https://discord.gg/VppTU9h").setStyle('Link')

    if (getCommand == "kilitle") {

      if (!interaction.channel.permissionsFor(interaction.guild.id).has("SendMessages") && interaction.channel.permissionsFor(client.user.id).has("SendMessages")) {

        return interaction.reply({
          embeds: [
            {
              color: client.settings.embedColors.red,
              title: `**»** \`#${interaction.channel.name}\` Kanalı Zaten Kilitli!`,
              description: `**•** Kilidi kaldırmak için \`/kilit kaldır\` yazabilirsin.`,
            }
          ],
          components: [
            {
              data: { type: 1 }, components: [destekSunucusuButton]
            },
          ]
        })

      }

      interaction.channel.permissionOverwrites.edit(interaction.guild.id, {
        SendMessages: false,
      });

      interaction.channel.permissionOverwrites.edit(client.user.id, {
        SendMessages: true,
      });

      interaction.reply({
        embeds: [
          {
            color: client.settings.embedColors.green,
            title: `**»** \`#${interaction.channel.name}\` Kanalı Başarıyla Kilitlendi!`,
            description: `**•** Kilidi kaldırmak için \`/kilit kaldır\` yazabilirsin.`,
          }
        ]
      })

    } else if (getCommand == "kaldır") {

      if (interaction.channel.permissionsFor(interaction.guild.id).has("SendMessages")) {

        return interaction.reply({
          embeds: [
            {
              color: client.settings.embedColors.red,
              title: `**»** \`#${interaction.channel.name}\` Kanalı Zaten Kilitli Değil!`,
              description: `**•** Kilitlemek için \`/kilit kilitle\` yazabilirsin.`,
            }
          ],
          components: [
            {
              data: { type: 1 }, components: [destekSunucusuButton]
            },
          ]
        })

      }

      interaction.channel.permissionOverwrites.edit(interaction.guild.id, {
        SendMessages: true,
      });

      interaction.reply({
        embeds: [
          {
            color: client.settings.embedColors.green,
            title: `**»** \`#${interaction.channel.name}\` Kanalının Kilidi Başarıyla Kaldırıldı!`,
            description: `**•** Herhangi bir sorun yaşarsan Nraphy'den destek alabilirsin.`,
          }
        ],
        components: [
          {
            type: 1, components: [destekSunucusuButton]
          },
        ]
      })

    }

  }
};