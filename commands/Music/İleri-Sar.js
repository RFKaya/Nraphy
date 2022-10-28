const Discord = require("discord.js");
const humanize = require("humanize-duration")

module.exports = {
    interaction: {
        name: "ileri-sar",
        description: "Çalan şarkıyı belirttiğiniz süre kadar ileri sarmanıza yarar.",
        options: [
            {
                name: "saniye",
                description: "Atlamak istediğin saniye miktarını gir.",
                type: 4,
                required: true
            },
        ]
    },
    interactionOnly: true,
    aliases: ["sar", "ilerisar", "ilerlet", "ilerle"],
    category: "Music",
    memberPermissions: [],
    botPermissions: ["SendMessages", "EmbedLinks"],
    nsfw: false,
    cooldown: 10000,
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

        if (!queue || !queue.nowPlaying()) return interaction.reply({
            embeds: [{
                color: client.settings.embedColors.red,
                description: "**»** Şu anda bir şarkı çalmıyor."
            }]
        });

        function hmsToSecondsOnly(str) {
            var p = str.split(':'),
                s = 0, m = 1;

            while (p.length > 0) {
                s += m * parseInt(p.pop(), 10);
                m *= 60;
            }

            return s;
        }

        var hms = await hmsToSecondsOnly(queue.nowPlaying().duration)

        const saniye = await interaction.options.getInteger("saniye");

        if (!saniye || isNaN(saniye) || saniye === 'Infinity') return interaction.reply({
            embeds: [{
                color: client.settings.embedColors.red,
                title: "**»** **1** ve **100** Arasında Bir Sayı Girmelisin!",
                description: `**•** Örnek kullanım: \`/ileri-sar 50\``
            }]
        })

        if (Math.round(saniye) < 1 || Math.round(saniye) > hms) return interaction.reply({
            embeds: [{
                color: client.settings.embedColors.red,
                title: `**»** Girdiğin Sayı **1**'den Az veya **${hms}**'den Çok Olamaz!`,
                description: `**•** Örnek kullanım: \`/ileri-sar 35\``
            }]
        })

        let time = (saniye * 1000);

        var musicTime = await hmsToSecondsOnly(await queue.getPlayerTimestamp().current) * 1000;

        let targetTime = await (musicTime + time)

        await queue.seek(targetTime);

        interaction.reply({
            embeds: [{
                color: client.settings.embedColors.green,
                title: `**»** Şarkı **${saniye} Saniye** İleri Sarıldı!`,
                description: `**•** Şarkı şuradan itibaren çalmaya başlanacak: \`${humanize((musicTime + time), { language: "tr", round: true })}\`!`
            }]
        })

    },
};