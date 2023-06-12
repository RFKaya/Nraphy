const Discord = require("discord.js");
const request = require("request");
const fs = require('fs');
const moment = require('moment');
const axios = require('axios');
const { MessageActionRow, ButtonBuilder } = require('discord.js');

module.exports = {
  name: "eval",
  description: "Eval",
  usage: "eval",
  aliases: [],
  category: "Developer",
  memberPermissions: [],
  botPermissions: ["SendMessages", "EmbedLinks"],
  nsfw: false,
  cooldown: false,
  ownerOnly: true,

  async execute(client, message, args, data) {

    if (message.author.id !== '700385307077509180') return;

    if (message.author.id == '700385307077509180') try {

      var code = args.join(' ');
      let hrTime = process.hrtime();
      let evaled = await eval(`async () => {${code}}`)();
      let hrDiff = process.hrtime(hrTime);

      evaled = require('util').inspect(evaled);

      if (!code) return message.react("❌");

      message.channel.send({
        embeds: [{
          color: client.settings.embedColors.default,
          fields: [
            {
              name: 'INPUT',
              value: `\`\`\`js\n${code.slice(0, 1000)}\`\`\``,
            },
            {
              name: `OUTPUT (\`${hrDiff[1] / 1000000} ms\`)`,
              value: `\`\`\`js\n${evaled.length > 1000 ? `${evaled.slice(0, 1000)}...` : `${clean(evaled)}`}\`\`\``,
            },
          ],
        }]
      });

    } catch (err) {

      message.channel.send({
        embeds: [{
          color: client.settings.embedColors.red,
          fields: [
            {
              name: 'INPUT',
              value: `\`\`\`js\n${code.slice(0, 1000)}\`\`\``,
            },
            {
              name: 'ERROR',
              value: `\`\`\`js\n${clean(err).length > 1000 ? `${clean(err).slice(0, 1000)}...` : `${clean(err)}`}\n\`\`\``,
            },
          ],
        }]
      });
    };

    function clean(text) {

      if (typeof (text) == 'string') return text.replace(/`/g, '`' + String.fromCharCode(8203)).replace(/@/g, '@' + String.fromCharCode(8203));
      else
        return text;
    };

  }
};