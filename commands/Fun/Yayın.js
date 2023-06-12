const Discord = require("discord.js");
const fetch = require('node-fetch');

module.exports = {
  interaction: {
    name: "etkinlik",
    description: "Topluca oyun oynamanıza veya YouTube izlemenize yarar.",
    options: [
      {
        name: "etkinlik",
        description: "Bulunduğun odada başlatılmasını istediğin etkinliği seç.",
        type: 3,
        required: true,
        choices: [
          { name: "YouTube", value: "yt" },
          { name: "Betrayal.io", value: "bio" },
          { name: "Poker Night", value: "pn" },
          { name: "Fishington", value: "fio" },
          { name: "Chess", value: "chs" },
          { name: "Wood Snacks", value: "wood" },
          { name: "Letter Tile", value: "letter" },
          { name: "Doodle crew", value: "doodlecrew" },
          { name: "Spellcast", value: "spellcast" },
          { name: "Checkers", value: "checkers" }
        ]
      },
    ]
  },
  interactionOnly: true,
  aliases: ["yt", "youtube", "etkinlik", "oyun", "yayın"],
  category: "Fun",
  memberPermissions: [],
  botPermissions: ["SendMessages", "EmbedLinks", "CreateInstantInvite"],
  nsfw: false,
  cooldown: false,
  ownerOnly: false,

  async execute(client, interaction, data) {

    var choice = interaction.options.getString("etkinlik");

    if (!interaction.member.voice.channel)
      return interaction.reply({
        embeds: [
          {
            color: client.settings.embedColors.red,
            title: '**»** Sesli Bir Odada Olman Gerekiyor!',
            description: `**•** Bir odaya katıl ve tekrar dene.`
          }
        ]
      });

    let embed = new Discord.EmbedBuilder()
      .setColor(client.settings.embedColors.default)
      .setTitle("**»** Bir etkinlik başlattın!");

    if (choice == 'yt') {
      fetch(`https://discord.com/api/v8/channels/${interaction.member.voice.channel.id}/invites`, {
        method: "POST",
        body: JSON.stringify({
          max_age: 86400,
          max_uses: 0,
          target_application_id: "880218394199220334",
          target_type: 2,
          temporary: false,
          validate: null
        }),
        headers: {
          "Authorization": `Bot ${client.token}`,
          "Content-Type": "application/json"
        }
      })
        .then(res => res.json())
        .then(invite => {
          embed.setDescription(`**•** [${interaction.member.voice.channel.name} odasında etkinliğe katılmak için buraya tıkla!](https://discord.gg/${invite.code})`);
          interaction.reply({ embeds: [embed] });
        });
    } else if (choice == 'bio') {
      fetch(`https://discord.com/api/v8/channels/${interaction.member.voice.channel.id}/invites`, {
        method: "POST",
        body: JSON.stringify({
          max_age: 86400,
          max_uses: 0,
          target_application_id: "773336526917861400",
          target_type: 2,
          temporary: false,
          validate: null
        }),
        headers: {
          "Authorization": `Bot ${client.token}`,
          "Content-Type": "application/json"
        }
      })
        .then(res => res.json())
        .then(invite => {
          embed.setDescription(`**•** [${interaction.member.voice.channel.name} odasında etkinliğe katılmak için buraya tıkla!](https://discord.gg/${invite.code})`);
          interaction.reply({ embeds: [embed] });
        });
    } else if (choice == 'pn') {
      fetch(`https://discord.com/api/v8/channels/${interaction.member.voice.channel.id}/invites`, {
        method: "POST",
        body: JSON.stringify({
          max_age: 86400,
          max_uses: 0,
          target_application_id: "755827207812677713",
          target_type: 2,
          temporary: false,
          validate: null
        }),
        headers: {
          "Authorization": `Bot ${client.token}`,
          "Content-Type": "application/json"
        }
      })
        .then(res => res.json())
        .then(invite => {
          embed.setDescription(`**•** [${interaction.member.voice.channel.name} odasında etkinliğe katılmak için buraya tıkla!](https://discord.gg/${invite.code})`);
          interaction.reply({ embeds: [embed] });
        });
    } else if (choice == 'chs') {
      fetch(`https://discord.com/api/v8/channels/${interaction.member.voice.channel.id}/invites`, {
        method: "POST",
        body: JSON.stringify({
          max_age: 86400,
          max_uses: 0,
          target_application_id: "832012586023256104",
          target_type: 2,
          temporary: false,
          validate: null
        }),
        headers: {
          "Authorization": `Bot ${client.token}`,
          "Content-Type": "application/json"
        }
      })
        .then(res => res.json())
        .then(invite => {
          embed.setDescription(`**•** [${interaction.member.voice.channel.name} odasında etkinliğe katılmak için buraya tıkla!](https://discord.gg/${invite.code})`);
          interaction.reply({ embeds: [embed] });
        });
    } else if (choice == 'fio') {
      fetch(`https://discord.com/api/v8/channels/${interaction.member.voice.channel.id}/invites`, {
        method: "POST",
        body: JSON.stringify({
          max_age: 86400,
          max_uses: 0,
          target_application_id: "814288819477020702",
          target_type: 2,
          temporary: false,
          validate: null
        }),
        headers: {
          "Authorization": `Bot ${client.token}`,
          "Content-Type": "application/json"
        }
      })
        .then(res => res.json())
        .then(invite => {
          embed.setDescription(`**•** [${interaction.member.voice.channel.name} odasında etkinliğe katılmak için buraya tıkla!](https://discord.gg/${invite.code})`);
          interaction.reply({ embeds: [embed] });
        });
    } else if (choice == 'wood') {
      fetch(`https://discord.com/api/v8/channels/${interaction.member.voice.channel.id}/invites`, {
        method: "POST",
        body: JSON.stringify({
          max_age: 86400,
          max_uses: 0,
          target_application_id: "879863976006127627",
          target_type: 2,
          temporary: false,
          validate: null
        }),
        headers: {
          "Authorization": `Bot ${client.token}`,
          "Content-Type": "application/json"
        }
      })
        .then(res => res.json())
        .then(invite => {
          embed.setDescription(`**•** [${interaction.member.voice.channel.name} odasında etkinliğe katılmak için buraya tıkla!](https://discord.gg/${invite.code})`);
          interaction.reply({ embeds: [embed] });
        });
    } else if (choice == 'letter') {
      fetch(`https://discord.com/api/v8/channels/${interaction.member.voice.channel.id}/invites`, {
        method: "POST",
        body: JSON.stringify({
          max_age: 86400,
          max_uses: 0,
          target_application_id: "879863686565621790",
          target_type: 2,
          temporary: false,
          validate: null
        }),
        headers: {
          "Authorization": `Bot ${client.token}`,
          "Content-Type": "application/json"
        }
      })
        .then(res => res.json())
        .then(invite => {
          embed.setDescription(`**•** [${interaction.member.voice.channel.name} odasında etkinliğe katılmak için buraya tıkla!](https://discord.gg/${invite.code})`);
          interaction.reply({ embeds: [embed] });
        });
    } else if (choice == 'doodlecrew') {
      fetch(`https://discord.com/api/v8/channels/${interaction.member.voice.channel.id}/invites`, {
        method: "POST",
        body: JSON.stringify({
          max_age: 86400,
          max_uses: 0,
          target_application_id: "878067389634314250",
          target_type: 2,
          temporary: false,
          validate: null
        }),
        headers: {
          "Authorization": `Bot ${client.token}`,
          "Content-Type": "application/json"
        }
      })
        .then(res => res.json())
        .then(invite => {
          embed.setDescription(`**•** [${interaction.member.voice.channel.name} odasında etkinliğe katılmak için buraya tıkla!](https://discord.gg/${invite.code})`);
          interaction.reply({ embeds: [embed] });
        });
    } else if (choice == 'spellcast') {
      fetch(`https://discord.com/api/v8/channels/${interaction.member.voice.channel.id}/invites`, {
        method: "POST",
        body: JSON.stringify({
          max_age: 86400,
          max_uses: 0,
          target_application_id: "852509694341283871",
          target_type: 2,
          temporary: false,
          validate: null
        }),
        headers: {
          "Authorization": `Bot ${client.token}`,
          "Content-Type": "application/json"
        }
      })
        .then(res => res.json())
        .then(invite => {
          embed.setDescription(`**•** [${interaction.member.voice.channel.name} odasında etkinliğe katılmak için buraya tıkla!](https://discord.gg/${invite.code})`);
          interaction.reply({ embeds: [embed] });
        });
    } else if (choice == 'checkers') {
      fetch(`https://discord.com/api/v8/channels/${interaction.member.voice.channel.id}/invites`, {
        method: "POST",
        body: JSON.stringify({
          max_age: 86400,
          max_uses: 0,
          target_application_id: "832013003968348200",
          target_type: 2,
          temporary: false,
          validate: null
        }),
        headers: {
          "Authorization": `Bot ${client.token}`,
          "Content-Type": "application/json"
        }
      })
        .then(res => res.json())
        .then(invite => {
          embed.setDescription(`**•** [${interaction.member.voice.channel.name} odasında etkinliğe katılmak için buraya tıkla!](https://discord.gg/${invite.code})`);
          interaction.reply({ embeds: [embed] });
        });
    } else {
      const embed = new Discord.EmbedBuilder()
        .setTitle(`**»** Geçersiz Bir Etkinlik Belirttin!`)
        .setDescription(
          `**•** Belirtebileceğin etkinlikler; \n\n` +
          `**•** YouTube, Betrayal.io, Poker Night, Fishington, Chess, Wood Snacks, Letter Tile, Doodle crew, Spellcast, Checkers`)
        .setColor(client.settings.embedColors.red);
      interaction.reply({ embeds: [embed] });
    }

    //Youtube: yt
    //Betrayal.io: bio
    //Poker Night: pn
    //Fishington.io: fio 
    //Chess: chs
    //Wood Snacks: wood
    //Letter Tile: letter
    //Doodle crew: doodlecrew
    //spellcast: spellcast
    //checkers: checkers

  }
};