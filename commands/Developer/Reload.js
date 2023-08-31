const fs = require("fs");

module.exports = {
  name: "reload",
  description: "31",
  category: "Developer",
  ownerOnly: true,

  async execute(client, message, args, data) {

    if (message.author.id !== '700385307077509180') return;

    if (message.author.id == '700385307077509180') try {

      message.react('✅');

      //------------------------------Command Loader------------------------------//
      const commandCategories = fs.readdirSync('./commands/');

      //client.logger.load(`Loading Commands...`)
      commandCategories.forEach(commandCategory => {
        fs.readdir(`./commands/${commandCategory}/`, (err, commandCategoryFiles) => {
          if (err) client.logger.error(err);

          commandCategoryFiles.forEach(commandFile => {
            delete require.cache[require.resolve(`../${commandCategory}/${commandFile}`)];

            let command = require(`../${commandCategory}/${commandFile}`);
            client.commands.set(command.interaction ? command.interaction.name : command.name, command);
            console.log(commandFile);
          });
        });
      });

    } catch (err) {

      console.error(err);
      client.logger.error(err);

    };

  }
};