//Tanımlar => Modüller
const { WebhookClient } = require('discord.js'),
  chalk = require("chalk"),
  fs = require("fs"),
  timestamp = require("./Date.js").timestamp();

//Tanımlar => logFile
var nowDate = new Date(),
  logFile = `./logs/log-${nowDate.getFullYear()}.${(nowDate.getMonth() + 1)}.txt`;

//Tanımlar => WebhookUrl
var webhookUrl = ''; //Enter webhook url here

exports.cmdLog = async (user, guild, type, cmdName, content) => {

  var capitalizeFirstLetter = ([first, ...rest], locale = navigator.language) => first.toLocaleUpperCase(locale) + rest.join('');

  //Console Log
  console.log(`${timestamp} ${chalk.white(`CMD (${type.toUpperCase()})`)} ${user.tag} (${user.id}) => ${capitalizeFirstLetter(cmdName, "tr")}`);

  //Log TXT
  fs.appendFile(logFile,
    `${timestamp} (CMD) (${type.toUpperCase()})\n` +
    ` => User: ${user.tag} (${user.id})\n` +
    ` => Guild: ${guild.name} (${guild.id})\n` +
    ` => CMD: ${capitalizeFirstLetter(cmdName, "tr")}\n` +
    ` => Content: ${content || "No Data"}\n\n`,
    function (err) {
      if (err) return console.log(err);
    });

};

exports.error = async (content) => {

  var dateNow = Date.now();

  //Console Log
  console.log(`${timestamp} ${chalk.red("ERROR")} ${content}`);
  console.error(content);

  //Log TXT
  fs.appendFile(logFile,
    `${timestamp} (ERROR) Error Log\n` +
    ` => ID: ${dateNow}\n` +
    ` => Content: ${content}\n\n`,
    function (err) {
      if (err) return console.log(err);
    });

  //Database Error Counter
  /*const clientDataSchema = require(".././Mongoose/Schema/clientData.js");
  clientDataSchema.findOne({ dataId: clientDataId })
    .then(clientData => {
      clientData.error += 1;
      clientData.markModified('error');
      clientData.save()
    })*/

  //Webhook Log
  if (webhookUrl) {
    var webhookClient = new WebhookClient({ url: webhookUrl });
    webhookClient.send({
      //content: "<@!700385307077509180>",
      embeds: [{
        color: 0xE74C3C,
        title: `**»** Hata Oluştu! (\`${dateNow}\`)`,
        description: `\`\`\`${content}\`\`\``,
      }]
    });
  }

};

//------------------------------⬇️ Eski ⬇️------------------------------//
exports.log = (content, type = "log") => {

  /*webhookClient.send({
    embeds: [{
      color: "eb064a",
      title: "**»** Allaaah, bisiler oldu event mevent var herhalde!",
      description: `\`\`\`${content}\`\`\``
    }]
  })*/

  switch (type) {
    case "client": {
      console.log(`${timestamp} ${chalk.blue(type.toUpperCase())} ${content} `); //cyan
      fs.appendFile(logFile, `\n\n\n${timestamp} (${type.toUpperCase()}) ${content}\n\n`,
        function (err) {
          if (err) return console.log(err);
        });
      return;
    }
    case 'shard': {
      console.log(`${timestamp} ${chalk.yellow(type.toUpperCase())} ${content} `);
      fs.appendFile(logFile, `${timestamp} (${type.toUpperCase()}) ${content}\n\n`,
        function (err) {
          if (err) return console.log(err);
        });
      return;
    }
    case "log": {
      console.log(`${timestamp} ${chalk.blue(type.toUpperCase())} ${content} `);
      fs.appendFile(logFile, `${timestamp} (${type.toUpperCase()}) ${content}\n\n`,
        function (err) {
          if (err) return console.log(err);
        });
      return;
    }
    case 'warn': {
      return console.log(`${timestamp} ${chalk.yellow(type.toUpperCase())} ${content} `);
    }
    case 'debug': {
      console.log(`${timestamp} ${chalk.gray(type.toUpperCase())}`, content);
      fs.appendFile(logFile, `${timestamp} (${type.toUpperCase()}) ${content}\n\n`,
        function (err) {
          if (err) return console.log(err);
        });
      return;
    }
    case 'interaction': {
      console.log(`${timestamp} ${chalk.white(type.toUpperCase())} ${content}`);
      fs.appendFile(logFile, `${timestamp} (${type.toUpperCase()}) Interaction Log\n • ${content}\n\n`,
        function (err) {
          if (err) return console.log(err);
        });
      return;
    }
    case 'ready': {
      return console.log(`${timestamp} ${chalk.green(type.toUpperCase())} ${content}`);
    }
    case 'slash': {
      return console.log(`${timestamp} ${chalk.yellow(type.toUpperCase())} ${content}`);
    }
    case 'load': {
      return console.log(`${timestamp} ${chalk.magenta(type.toUpperCase())} ${content} `);
    }
    case 'event': {
      return console.log(`${timestamp} ${chalk.cyan(type.toUpperCase())} ${content} `);
    }
    default: throw new TypeError('Wrong type');
  }
};

exports.client = (...args) => this.log(...args, 'client');

exports.shard = (...args) => this.log(...args, 'shard');

exports.warn = (...args) => this.log(...args, 'warn');

exports.debug = (...args) => this.log(...args, 'debug');

exports.interaction = (...args) => this.log(...args, 'interaction');

exports.ready = (...args) => this.log(...args, 'ready');

exports.slash = (...args) => this.log(...args, 'slash');

exports.load = (...args) => this.log(...args, 'load');

exports.event = (...args) => this.log(...args, 'event');
