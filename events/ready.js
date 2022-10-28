const db = require("quick.db"),
  tcpPortUsed = require('tcp-port-used'),
  { ButtonBuilder, WebhookClient } = require('discord.js'),
  topgg = require(`@top-gg/sdk`),
  random = require("random");

module.exports = async (client) => {

  try {

    //------------------------------Oynuyor------------------------------//

    client.user.setPresence({
      activities: [{
        name: client.settings.presence,
        type: 5, //LISTENING - WATCHING - PLAYING - STREAMING
      }],
      //status: "online", //online, idle, dnd
    });//.catch(console.error);

    //------------------------------Oynuyor------------------------------//

    //------------------------------Bot İstatistik------------------------------//

    /*var clientData = await client.database.fetchClientData(global.clientDataId);
    clientData.crash += 1;
    clientData.markModified('crash');
    await clientData.save();*/

    //------------------------------Bot İstatistik------------------------------//

    //------------------------------Dashboard------------------------------//

    /*tcpPortUsed.check(client.settings.webPanel.port, client.settings.webPanel.clientIP)
      .then(function (inUse) {
        if (!inUse) try {
          client.logger.log("web panel başlatılıyo");
          const Dashboard = require('../dashboard/dashboard');
          Dashboard(client);
        } catch (err) {
          client.logger.error("web panel sisteminde bir sorun oldu!");
        }
      }, function (err) {
        console.error('Error on port check:', err.message);
        client.logger.error('Error on port check: ' + err.message);
      });*/

    //------------------------------Dashboard------------------------------//

  } catch (err) { client.logger.error(err); };
};
