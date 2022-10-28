const Discord = require("discord.js");

module.exports = {
    interaction: {
        name: "sırayı-temizle",
        description: "Şarkı sırasını temizler.",
        options: []
    },
    interactionOnly: true,
    aliases: ["clear-queue", "cq", "st", "sırayıtemizle"],
    category: "Music",
    memberPermissions: [],
    botPermissions: ["SendMessages", "EmbedLinks"],
    nsfw: false,
    cooldown: false,
    ownerOnly: false,

    async execute(client, interaction, data) {

        if (!interaction.member.voice.channel) return interaction.reply({
            embeds: [{
                color: client.settings.embedColors.red,
                description: "**»** Bir odada değilsin. Herhangi bir odaya geç ve tekrar dene!"
            }]
        });

        if (interaction.guild.members.me.voice.channel && interaction.member.voice.channel.id !== interaction.guild.members.me.voice.channel.id) return interaction.reply({
            embeds: [{
                color: client.settings.embedColors.red,
                description: "**»** Aynı odada değiliz! Bulunduğum odaya katıl ve tekrar dene!"
            }]
        });

        const queue = client.player.getQueue(interaction.guild);

        if (queue.tracks.length <= 1) return interaction.reply({
            embeds: [{
                color: client.settings.embedColors.red,
                description: "**»** Sırada bir şarkı bulunmuyor."
            }]
        })

        queue.clear();

        interaction.reply({
            embeds: [{
                color: client.settings.embedColors.green,
                description: "**»** Şarkı sırası başarıyla temizlendi!"
            }]
        })
    },
};