module.exports = async (client, message) => {

  if (!message.guild) return;
  if (!message.channel) return;
  if (message.author.bot) return;

  const guildData = await client.database.fetchGuild(message.guild.id);
  var userData;

  const prefix = guildData.prefix || client.settings.prefix;

  const userCache = client.userDataCache[message.author.id] || (client.userDataCache[message.author.id] = {});

  try {

    //MessageStats
    /*if (message.guild.id === "532991144112554005") {
      var nowDate = new Date();
      var date = `${nowDate.getFullYear()}.${(nowDate.getMonth() + 1)}.${nowDate.getDate()}`;
      console.log(date)
    }*/

    //Commands
    if (message.content.toLowerCase().startsWith(prefix.toLowerCase())) {

      //Checking if the message is a command
      const args = message.content.slice(prefix.length).trim().split(/ +/g);
      const commandName = args.shift().toLowerCase();
      const cmd = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases?.includes(commandName));
      if (!cmd) return;

      userData ||= await client.database.fetchUser(message.author.id);

      await require('../events/functions/cmdExecuter.js')(client, message, cmd, guildData, userData, args);

    }

    //Bağlantı Engel
    const linkBlock = guildData.linkBlock;
    if (linkBlock && message.content)
      require("./functions/linkBlock")(client, message, linkBlock, false);

    //Galeri
    let gallery = guildData.gallery;
    if (gallery)
      require("./functions/gallery.js")(client, message, gallery);

    //Spam Koruması
    const spamProtection = guildData.spamProtection;
    if (spamProtection && message.content)
      require("./functions/spamProtection.js")(client, message, spamProtection);

    //CapsLock Block
    //client.logger.log(`CAPSLOCK-ENGEL TETİKLENDİ! • ${message.guild.name} (${message.guild.id})`);
    require("./functions/upperCaseBlock.js")(client, message, guildData);

    //Kelime Oyunu
    var wordGame = guildData.wordGame;
    if (wordGame?.channel === message.channel.id) {
      client.logger.log(`KELİME-OYUNU TETİKLENDİ! • ${message.guild.name} (${message.guild.id})`);
      require("./functions/wordGame.js")(client, message, wordGame, guildData);
    }

    if (userCache.lastMessage && Date.now() - userCache.lastMessage < 2000)
      return;
    userCache.lastMessage = Date.now();

    //Prefixim & Soru-Sor
    if (message.content.toLowerCase() === `<@!${client.user.id}>` || message.content.toLowerCase() === `<@${client.user.id}>`) {

      message.channel.send({
        embeds: [{
          color: client.settings.embedColors.default,
          description: `**»** Prefixim \`${prefix}\` • \`${prefix}komutlar\` yazarak tüm komutlara ulaşabilirsin.`
        }]
      }).catch(e => { });

    }

    userData ||= await client.database.fetchUser(message.author.id, false);

    //AFK
    if (userData?.AFK?.time) {
      client.logger.log(`AFK SİSTEMİ TETİKLENDİ! • ${message.guild.name} (${message.guild.id})`);
      require("./functions/AFK.js").removeAFK(client, message, userData);
    }
    if (message.mentions.users.first()) {
      let mentionUserData = await client.database.fetchUser(message.mentions.users.first().id, false);
      if (mentionUserData?.AFK?.time) {
        client.logger.log(`AFK SİSTEMİ TETİKLENDİ! • ${message.guild.name} (${message.guild.id})`);
        require("./functions/AFK.js").userIsAFK(client, message, mentionUserData);
      }
    }

  } catch (err) { client.logger.error(err); };
};
