const chalk = require("chalk"),
  fs = require("fs"),
  dateModule = require("./Date.js"),
  capitalizeFirstLetter = ([first, ...rest], locale = "tr-TR") => first.toLocaleUpperCase(locale) + rest.join(''),
  config = require("../config.json");

function logTXT(content) {

  let nowDate = new Date(),
    logFile = `./logs/log-${nowDate.getFullYear()}.${(nowDate.getMonth() + 1)}.txt`;

  fs.appendFile(logFile, content,
    function (err) {
      if (err) return console.log(err);
    });

}

//---------------cmdLog---------------//
exports.cmdLog = async (user, guild, type, cmdName, content) => {

  let timestamp = dateModule.timestamp();

  //Console Log
  console.log(`${timestamp} ${chalk.white(`CMD (${type.toUpperCase()})`)} ${user.tag} (${user.id}) => ${capitalizeFirstLetter(cmdName, "tr")}`);

  //Log TXT
  logTXT(`${timestamp} (CMD) (${type.toUpperCase()})\n` +
    ` => User: ${user.tag} (${user.id})\n` +
    ` => Guild: ${guild.name} (${guild.id})\n` +
    ` => CMD: ${capitalizeFirstLetter(cmdName, "tr")}\n` +
    (content ? ` => Content: ${content}\n\n` : `\n`));

  //Client commandUses
  const Mongoose = require(".././Mongoose/Mongoose.js");
  var clientData = await Mongoose.fetchClientData();
  if (!clientData.commandUses[cmdName])
    clientData.commandUses[cmdName] = 1; else
    clientData.commandUses[cmdName] += 1;
  clientData.markModified(`commandUses.${cmdName}`);
  await clientData.save();

  //User commandUses
  let userDataQueue = global.client.databaseQueue.users[user.id] ||= {};
  (userDataQueue.statistics ||= {}).commandUses ||= 0;
  (userDataQueue.statistics ||= {}).commandUses += 1;

  /*var userData = await Mongoose.fetchUser(user.id);
  userData.statistics.commandUses += 1;
  if (userData.commandUses) {
    userData.statistics.commandUses += userData.commandUses;
    userData.commandUses = undefined;
  }
  await userData.save();*/

  //You have 500 times or multiplies commandUses!
  /*console.log(userData.commandUses);
  if (userData.commandUses && (userData.commandUses % 500 == 0)) {
    user.send({ content: "sa reis" });
  }*/

};

//---------------error---------------//
exports.error = async (content) => {

  try {

    let dateNow = Date.now();
    let timestamp = dateModule.timestamp();

    //Console Log
    //console.log(`${timestamp} ${chalk.red("ERROR")} ${content}`);
    console.log(`${timestamp} ${chalk.red("ERROR")}`);
    console.error(content);
    if (content.requestBody?.json?.data?.embeds) console.log("error.requestBody.json.data.embeds:", content.requestBody.json.data.embeds);
    else if (content.requestBody?.json?.embeds) console.log("error.requestBody.json.embeds:", content.requestBody.json.embeds);
    else if (content.requestBody?.json) console.log("error.requestBody.json:", content.requestBody.json);

    //Log TXT
    logTXT(`${timestamp} (ERROR) Error Log\n` +
      ` => ID: ${dateNow}\n` +
      ` => Content: ${content}\n\n`);

    //Database Error Counter
    const Mongoose = require(".././Mongoose/Mongoose.js");
    var clientData = await Mongoose.fetchClientData();
    clientData.error += 1;
    clientData.markModified('error');
    await clientData.save();

    //Webhook Log
    global.client.clientDataCache.logQueue.push({
      color: 0xE74C3C,
      title: `**»** Hata Oluştu! (\`${dateNow}\`)`,
      description: `\`\`\`${content}\`\`\``,
    });


  } catch (error) {

    console.log(chalk.red("KRİTİK HATA! HATA LOGLAMA SİSTEMİNDE BİR HATA MEYDANA GELDİ!"));
    console.log(error);

  }

};

//---------------warn---------------//
exports.warn = async (content) => {

  let nowDate = new Date(),
    logFile = `./logs/log-${nowDate.getFullYear()}.${(nowDate.getMonth() + 1)}.txt`;
  let dateNow = Date.now();
  let timestamp = dateModule.timestamp();

  //Console Log
  console.log(`${timestamp} ${chalk.yellow("WARN")} ${content}`);

  //Log TXT
  logTXT(`${timestamp} (WARN) \n` +
    ` => Date Timestamp: ${dateNow}\n` +
    ` => Content: ${content}\n\n`);

  //Webhook Log
  global.client.clientDataCache.logQueue.push({
    color: 0xFEE75C,
    title: `**»** Uyarı! (\`${dateNow}\`)`,
    description: `\`\`\`${content}\`\`\``,
  });

};

//------------------------------⬇️ Eski ⬇️------------------------------//
exports.log = (content, type = "log", writeFileLog = true, sendWebhookMessage = false) => {

  let timestamp = dateModule.timestamp();

  if (type !== "interaction" && writeFileLog)
    logTXT(`${timestamp} (${type.toUpperCase()}) ${content}\n\n`);

  //Webhook Log
  if (sendWebhookMessage)
    global.client.clientDataCache.logQueue.push({
      color: 0x3498DB,
      description: `\`\`\`${content}\`\`\``,
    });

  switch (type) {
    case "client": {
      return console.log(`${timestamp} ${chalk.blue(type.toUpperCase())} ${content} `); //cyan
    }
    case 'shard': {
      return console.log(`${timestamp} ${chalk.yellow(type.toUpperCase())} ${content} `);
    }
    case "log": {
      return console.log(`${timestamp} ${chalk.blue(type.toUpperCase())} ${content} `);
    }
    case 'debug': {
      return console.log(`${timestamp} ${chalk.gray(type.toUpperCase())}`, content);
    }
    /*case 'cmd': {
      console.log(`${timestamp} ${chalk.white(type.toUpperCase())} ${content}`);
      fs.appendFile(logFile, `${timestamp} (${type.toUpperCase()}) Command Usage Log\n • ${content}\n\n`,
        function (err) {
          if (err) return console.log(err);
        });
      const clientDataSchema = require(".././Mongoose/Schema/clientData.js");
      clientDataSchema.findOne({ dataId: clientDataId })
        .then(clientData => {
          clientData.cmd += 1;
          clientData.markModified('cmd');
          clientData.save()
        })
      return;
    }*/
    case 'interaction': {
      console.log(`${timestamp} ${chalk.white(type.toUpperCase())} ${content}`);
      /*fs.appendFile(logFile, `${timestamp} (${type.toUpperCase()}) Interaction Log\n • ${content}\n\n`,
        function (err) {
          if (err) return console.log(err);
        });*/
      return;
    }
    /*case 'interactionCmd': {
      console.log(`${timestamp} ${chalk.white(type.toUpperCase())} ${content}`);
      fs.appendFile(logFile, `${timestamp} (${type.toUpperCase()}) Interaction Command Usage Log\n • ${content}\n\n`,
        function (err) {
          if (err) return console.log(err);
        });
      const clientDataSchema = require(".././Mongoose/Schema/clientData.js");
      clientDataSchema.findOne({ dataId: clientDataId })
        .then(clientData => {
          clientData.interactionCmd += 1;
          clientData.markModified('interactionCmd');
          clientData.save();
        });
      return;
    }*/
    case 'ready': {
      return console.log(`${timestamp} ${chalk.green(type.toUpperCase())} ${content}`);
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
exports.debug = (...args) => this.log(...args, 'debug');
exports.interaction = (...args) => this.log(...args, 'interaction');
exports.ready = (...args) => this.log(...args, 'ready');
exports.load = (...args) => this.log(...args, 'load');
exports.event = (...args) => this.log(...args, 'event');