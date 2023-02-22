module.exports = {
  interaction: {
    name: "yetkiler",
    description: "Kendinizin/etiketlediğiniz üyenin yetkilerini gösterir.",
    options: [
      {
        name: "kullanıcı",
        description: "Bir kullanıcı ID'si ya da etiketi gir.",
        type: 6,
        required: false
      },
    ]
  },
  aliases: ["izinler", "yetkilerim", 'roller', 'rollerim'],
  category: "General",
  memberPermissions: [],
  botPermissions: ["SendMessages", "EmbedLinks"],
  nsfw: false,
  cooldown: false,
  ownerOnly: false,

  async execute(client, interaction, data, args) {

    var member;
    if (interaction.type == 2) {
      member = interaction.guild.members.cache.get(interaction.options.getUser("kullanıcı")?.id) || interaction.member;
    } else {
      member = interaction.mentions.members.first() || interaction.guild.members.cache.get(args[0]) || interaction.member;
    }

    let yetkiVarEmoji = "<:aktif:855802622132879361>";
    let yetkiYokEmoji = "<:deaktif:855802066425610270>";

    const permissionsMap = require("../../utils/Permissions.json");

    let permissions = [
      "Administrator",
      "ManageChannels",
      "ManageGuild",
      "ViewAuditLog",
      "ViewChannel",
      "ViewGuildInsights",
      "ManageRoles",
      "ManageWebhooks",
      "ManageEmojisAndStickers",
      "ManageEvents",
    ];
    let permissionsState = [];
    permissions.forEach(permission => {
      if (member.permissions.has(permission)) {
        permissionsState.push(`${yetkiVarEmoji} ${permissionsMap[permission]}`);
      } else {
        permissionsState.push(`${yetkiYokEmoji} ${permissionsMap[permission]}`);
      };
    });

    //Membership Permissions
    let membershipPermissions = [
      "CreateInstantInvite",
      "KickMembers",
      "BanMembers",
      "ChangeNickname",
      "ManageNicknames",
      "ModerateMembers",
    ];
    let membershipPermissionsState = [];
    membershipPermissions.forEach(permission => {
      if (member.permissions.has(permission)) {
        membershipPermissionsState.push(`${yetkiVarEmoji} ${permissionsMap[permission]}`);
      } else {
        membershipPermissionsState.push(`${yetkiYokEmoji} ${permissionsMap[permission]}`);
      };
    });

    //Text Channel Permissions
    let textChannelPermissions = [
      "AddReactions",
      "SendMessages",
      "SendTTSMessages",
      "ManageMessages",
      "EmbedLinks",
      "AttachFiles",
      "ReadMessageHistory",
      "MentionEveryone",
      "UseExternalEmojis",
      "UseApplicationCommands",
      "ManageThreads",
      "CreatePublicThreads",
      "CreatePrivateThreads",
      "UseExternalStickers",
      "SendMessagesInThreads",
    ];
    let textChannelPermissionsState = [];
    textChannelPermissions.forEach(permission => {
      if (member.permissions.has(permission)) {
        textChannelPermissionsState.push(`${yetkiVarEmoji} ${permissionsMap[permission]}`);
      } else {
        textChannelPermissionsState.push(`${yetkiYokEmoji} ${permissionsMap[permission]}`);
      };
    });

    //Voice Channel Permissions
    let voiceChannelPermissions = [
      "PrioritySpeaker",
      "Stream",
      "Connect",
      "Speak",
      "MuteMembers",
      "DeafenMembers",
      "MoveMembers",
      "UseVAD",
      "RequestToSpeak",
    ];
    let voiceChannelPermissionsState = [];
    voiceChannelPermissions.forEach(permission => {
      if (member.permissions.has(permission)) {
        voiceChannelPermissionsState.push(`${yetkiVarEmoji} ${permissionsMap[permission]}`);
      } else {
        voiceChannelPermissionsState.push(`${yetkiYokEmoji} ${permissionsMap[permission]}`);
      };
    });

    return interaction.reply({
      embeds: [
        {
          color: client.settings.embedColors.default,
          author: {
            name: `${member.user.username} kullanıcısının yetkileri`,
            icon_url: member.displayAvatarURL(),
          },
          fields: [
            {
              name: '**»** Üyelik İzinleri',
              value: membershipPermissionsState.join("\n"),
            },
            {
              name: '**»** Metin Kanalı İzinleri',
              value: textChannelPermissionsState.join("\n"),
            },
            {
              name: '**»** Ses Kanalı İzinleri',
              value: voiceChannelPermissionsState.join("\n"),
            },
            {
              name: '**»** Diğer İzinler',
              value: permissionsState.join("\n"),
            },
          ],
        }
      ]
    });

  }
};