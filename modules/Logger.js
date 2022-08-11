const { WebhookClient } = require('discord.js');
const chalk = require("chalk");
const fs = require("fs");

exports.log = (content, type = "log") => {

  var nowDate = new Date();
  var date = `${nowDate.getFullYear()}.${(nowDate.getMonth() + 1)}`;
  var logFile = `./logs/log-${date}.txt`

  var date = require("./Date.js");
  var timestamp = date.timestamp()

  var clientDataId = global.clientDataId

  switch (type) {
    case "client": {
      console.log(`${timestamp} ${chalk.blue(type.toUpperCase())} ${content} `); //cyan
      fs.appendFile(logFile, `\n\n\n${timestamp} (${type.toUpperCase()}) ${content}\n\n`,
        function (err) {
          if (err) return console.log(err)
        });
      return;
    }
    case 'shard': {
      console.log(`${timestamp} ${chalk.yellow(type.toUpperCase())} ${content} `);
      fs.appendFile(logFile, `${timestamp} (${type.toUpperCase()}) ${content}\n\n`,
        function (err) {
          if (err) return console.log(err)
        });
      return;
    }
    case "log": {
      console.log(`${timestamp} ${chalk.blue(type.toUpperCase())} ${content} `);
      fs.appendFile(logFile, `${timestamp} (${type.toUpperCase()}) ${content}\n\n`,
        function (err) {
          if (err) return console.log(err)
        });
      return;
    }
    case 'warn': {
      return console.log(`${timestamp} ${chalk.yellow(type.toUpperCase())} ${content} `);
    }
    case 'error': {

      let dateNow = Date.now();

      console.log(`${timestamp} ${chalk.red(type.toUpperCase())} ${content} `);
      //console.log(content);
      fs.appendFile(logFile, `${timestamp} (${type.toUpperCase()}) Error Log (ID: ${dateNow})\n • ${content}\n\n`,
        function (err) {
          if (err) return console.log(err)
        });
      const clientDataSchema = require(".././Mongoose/Schema/clientData.js");
      clientDataSchema.findOne({ dataId: clientDataId })
        .then(clientData => {
          clientData.error += 1;
          clientData.markModified('error');
          clientData.save()
        })
      return;
    }
    case 'debug': {
      console.log(`${timestamp} ${chalk.gray(type.toUpperCase())}`, content);
      fs.appendFile(logFile, `${timestamp} (${type.toUpperCase()}) ${content}\n\n`,
        function (err) {
          if (err) return console.log(err)
        });
      return;
    }
    case 'cmd': {
      console.log(`${timestamp} ${chalk.white(type.toUpperCase())} ${content}`);
      fs.appendFile(logFile, `${timestamp} (${type.toUpperCase()}) Command Usage Log\n • ${content}\n\n`,
        function (err) {
          if (err) return console.log(err)
        });
      const clientDataSchema = require(".././Mongoose/Schema/clientData.js");
      clientDataSchema.findOne({ dataId: clientDataId })
        .then(clientData => {
          clientData.cmd += 1;
          clientData.markModified('cmd');
          clientData.save()
        })
      return;
    }
    case 'interaction': {
      console.log(`${timestamp} ${chalk.white(type.toUpperCase())} ${content}`);
      fs.appendFile(logFile, `${timestamp} (${type.toUpperCase()}) Interaction Log\n • ${content}\n\n`,
        function (err) {
          if (err) return console.log(err)
        });
      return;
    }
    case 'interactionCmd': {
      console.log(`${timestamp} ${chalk.white(type.toUpperCase())} ${content}`);
      fs.appendFile(logFile, `${timestamp} (${type.toUpperCase()}) Interaction Command Usage Log\n • ${content}\n\n`,
        function (err) {
          if (err) return console.log(err)
        });
      const clientDataSchema = require(".././Mongoose/Schema/clientData.js");
      clientDataSchema.findOne({ dataId: clientDataId })
        .then(clientData => {
          clientData.interactionCmd += 1;
          clientData.markModified('interactionCmd');
          clientData.save()
        })
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
    default: throw new TypeError('Yanlış tür sectin usta');
  }
};

exports.client = (...args) => this.log(...args, 'client');

exports.shard = (...args) => this.log(...args, 'shard');

exports.error = (...args) => this.log(...args, 'error');

exports.warn = (...args) => this.log(...args, 'warn');

exports.debug = (...args) => this.log(...args, 'debug');

exports.cmd = (...args) => this.log(...args, 'cmd');

exports.interaction = (...args) => this.log(...args, 'interaction');

exports.interactionCmd = (...args) => this.log(...args, 'interactionCmd');

exports.ready = (...args) => this.log(...args, 'ready');

exports.slash = (...args) => this.log(...args, 'slash');

exports.load = (...args) => this.log(...args, 'load');

exports.event = (...args) => this.log(...args, 'event');
