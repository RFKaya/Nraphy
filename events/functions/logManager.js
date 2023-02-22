const { WebhookClient } = require('discord.js');
const db = require("quick.db");

module.exports = async (client, guildData, logMessageContent) => {

  try {

    //Eski log sistemini yeniye geçirme kodları
    let eskiLogger = db.fetch(`guilds.${guildData.guildId}.logger`);
    if (eskiLogger) {
      guildData.logger.webhook = eskiLogger.webhook;
      guildData.markModified('logger.webhook');
      await guildData.save();
      db.delete(`guilds.${guildData.guildId}.logger`);
      console.log("eski log sistemi yeniye geçirildi");
    }

    //Logging
    let webhookClient = new WebhookClient({ url: guildData.logger.webhook });
    webhookClient.send(logMessageContent)
      .catch(async error => {
        if (error.code == 10015) {
          client.logger.log(`Log sisteminde Webhook silinmiş. Log sıfırlanıyor... • ${guildData.guildId}`);
          guildData.logger.webhook = null;
          guildData.markModified('logger.webhook');
          await guildData.save();
        } else {
          console.log(error);
        }
      });

  } catch (err) { client.logger.error(err); };
};
