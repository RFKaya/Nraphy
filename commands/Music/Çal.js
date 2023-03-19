const { ButtonBuilder } = require('discord.js');

module.exports = {
  interaction: {
    name: "çal",
    description: "Bağlantısını veya adını girdiğiniz şarkıyı/oynatma listesini çalar.",
    options: [
      {
        name: "şarkı",
        description: "Bir şarkı adı ya da bağlantısı gir.",
        type: 3,
        required: true
      },
    ]
  },
  aliases: ["play", "p", "oynat", "ç", "oynat", "şarkı"],
  category: "Music",
  memberPermissions: [],
  botPermissions: ["SendMessages", "EmbedLinks", "AddReactions"],
  nsfw: false,
  cooldown: 3000,
  ownerOnly: false,

  async execute(client, interaction, data, args) {

    if (!interaction.member.voice.channel)
      return interaction.reply({
        embeds: [{
          color: client.settings.embedColors.red,
          description: "**»** Bir odada değilsin. Herhangi bir odaya geç ve tekrar dene!"
        }]
      });

    if (interaction.guild.members.me.voice.channel && interaction.member.voice.channel.id !== interaction.guild.members.me.voice.channel.id)
      return interaction.reply({
        embeds: [{
          color: client.settings.embedColors.red,
          description: "**»** Aynı odada değiliz! Bulunduğum odaya katıl ve tekrar dene!"
        }]
      });

    const music = interaction.type == 2 ? interaction.options.getString("şarkı") : args.join(' ');

    if (!music)
      return interaction.reply({
        embeds: [{
          color: client.settings.embedColors.red,
          description: `**»** Bir şarkı adı/bağlantısı girmelisin! \`/çal Faded\``
        }]
      });

    if (interaction.type == 2)
      await interaction.deferReply();
    else await interaction.react('✅').catch(e => { });

    try {

      await client.distube.play(interaction.member.voice.channel, music, {
        member: interaction.member,
        textChannel: interaction.channel,
        voiceChannel: interaction.member.voice.channel,
        metadata: {
          commandMessage: interaction
        }
      });

    } catch (error) {

      require('../../events/distube/functions/errorHandler.js')(client, error, interaction.channel, interaction);

    }

  },
};