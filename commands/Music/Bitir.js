const Discord = require("discord.js");

module.exports = {
    interaction: {
        name: "bitir",
        description: "Şarkı sırasını temizler ve odadan ayrılır.",
        options: []
    },
    aliases: ['dc', "stop", "leave", "ayrıl"],
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

        if (!queue) return interaction.reply({
            embeds: [{
                color: client.settings.embedColors.red,
                description: "**»** Şu anda bir şarkı çalmıyor."
            }]
        });

        queue.destroy();

        interaction.reply({
            embeds: [{
                color: client.settings.embedColors.default,
                title: "**»** Oynatma Sonlandırıldı!",
                description: `**•** Şarkı sırası temizlendi ve oynatma bitirildi.`
            }]
        });
    },
};