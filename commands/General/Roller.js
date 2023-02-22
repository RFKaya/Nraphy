module.exports = {
  interaction: {
    name: "roller",
    description: "Sunucudaki rolleri listeler.",
    options: [],
  },
  aliases: ["roles"],
  category: "General",
  memberPermissions: [],
  botPermissions: ["SendMessages", "EmbedLinks"],
  nsfw: false,
  cooldown: false,
  ownerOnly: false,

  async execute(client, interaction, data) {

    let roles = interaction.guild.roles.cache
      .filter(role => role != interaction.guild.id)
      .sort((roleA, roleB) => roleB.rawPosition - roleA.rawPosition);

    return interaction.reply({
      content: `\`\`\`${roles.map(role => `${role.name}${" ".repeat(25 - role.name.length > 0 ? 25 - role.name.length : 1)}${role.members.size} üye`).join('\n').slice(0, 1988)}\`\`\``
    });

  }
};