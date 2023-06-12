const { WebhookClient } = require('discord.js');

module.exports = async (client, guildData, logMessageContent) => {

  if (!guildData.logger?.webhook) return;

  try {

    const guildDataCache = client.guildDataCache[guildData.guildId] || (client.guildDataCache[guildData.guildId] = {});
    guildDataCache.logQueue ||= [];
    guildDataCache.logQueue.push(...logMessageContent.embeds);

    //Logging
    /*let webhookClient = new WebhookClient({ url: guildData.logger.webhook });
    webhookClient.send(logMessageContent)
      .catch(async error => {
        if (error.code == 10015) {
          guildData.logger.webhook = null;
          guildData.markModified('logger.webhook');
          await guildData.save();
        } else {
          client.logger.error(error);
        }
      });*/

  } catch (err) { client.logger.error(err); };
};

module.exports.errors = async (client, guildData, error) => {

  try {

    if (error.code === 50013) {

      if (guildData.logger?.webhook) {

        let webhookClient = new WebhookClient({ url: guildData.logger.webhook });
        webhookClient.send({
          embeds: [
            {
              color: client.settings.embedColors.red,
              title: `**»** Yetkilerim Yetersiz Olduğu İçin Hata Oluştu!`,
              description:
                '**•** Bu nedenle log sistemini kapattım.\n' +
                '**•** Yetkilerimi düzenledikten sonra tekrar ayarlayabilirsin.'
            }
          ]
        }).catch(e => { });

        guildData.logger.webhook = null;
        guildData.markModified('logger.webhook');
        await guildData.save();

      }

    } else {
      client.logger.error(error);
    }

  } catch (err) { client.logger.error(err); };
};