module.exports = {
  interaction: {
    name: "çal",
    description: "Adını veya bağlantısını girdiğiniz şarkıyı/oynatma listesini çalar.",
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
  category: "Music_Player",
  memberPermissions: [],
  botPermissions: ["SendMessages", "EmbedLinks", "AddReactions"],
  nsfw: false,
  cooldown: 5000,
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

    const music = interaction.type === 2 ? interaction.options.getString("şarkı") : args.join(' ');

    if (!music)
      return interaction.reply({
        embeds: [{
          color: client.settings.embedColors.red,
          description: `**»** Bir şarkı adı/bağlantısı girmelisin! \`/çal Faded\``
        }]
      });

    const queue = client.distube.getQueue(interaction.guild);

    if (!data.guildIsBoosted && queue?.songs.length > 200)
      return interaction.reply({
        embeds: [{
          color: client.settings.embedColors.red,
          description:
            `**»** Şarkı sırası tamamen dolu. Daha fazla şarkı ekleyemezsin.\n` +
            `**•** **Nraphy Boost** ile bu limiti sınırsıza çıkarabilirsin! \`/boost bilgi\``
        }]
      });

    if (interaction.type === 2)
      await interaction.deferReply();
    else await interaction.react('✅').catch(e => { });

    await client.distube.play(interaction.member.voice.channel, music, {
      member: interaction.member,
      textChannel: interaction.channel,
      voiceChannel: interaction.member.voice.channel,
      metadata: {
        commandMessage: interaction
      }
    }).catch(error => require('../../events/distube/functions/errorHandler.js')(client, error, interaction.channel, interaction));

  },
};