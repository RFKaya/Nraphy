module.exports = async (client, interaction) => {

  if (interaction.type !== 2)
    client.logger.interaction(`user: ${interaction.user.tag} (${interaction.user.id}), type: ${interaction.type}, customId: ${interaction.customId}`);

  if (!interaction.guild)
    return interaction.reply({ content: ":x: | Etkileşim komutları maalesef DM'de kullanılamamaktadır." });

  try {

    if (interaction.type == 2) {

      let cmd = client.commands.get(interaction.commandName);
      if (!cmd) return;

      var guildData = await client.database.fetchGuild(interaction.guild.id);
      var userData = await client.database.fetchUser(interaction.user.id);

      await require('../events/functions/cmdExecuter.js')(client, interaction, cmd, guildData, userData, null);

    } else if (interaction.type == 3)

      if (interaction.componentType == 2) {

        let guildData = await client.database.fetchGuild(interaction.guild.id);

        /*//Geçici Kanallar
        if (interaction.customId === "tempChannels_deleteChannel") {
          client.logger.log(`GEÇİCİ KANALLAR TETİKLENDİ! (KANAL SİLME İŞLEMİ) • ${interaction.guild.name} (${interaction.guild.id})`);
          require("./functions/tempChannels.js").deleteChannel(client, interaction, guildData);
        }*/

        //Buton-Rol
        if (Object.keys(guildData.buttonRole || {}).length && guildData.buttonRole[interaction.message.id]) {
          client.logger.log(`BUTON-ROL TETİKLENDİ! • ${interaction.guild.name} (${interaction.guild.id})`);
          require("./functions/buttonRole.js")(client, interaction, guildData);
        }
      }

  } catch (err) { client.logger.error(err); };

};