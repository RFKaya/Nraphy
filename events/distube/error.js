module.exports = async (client, channel, error) => {

  try {

    require('./functions/errorHandler.js')(client, error, channel);

  } catch (err) { client.logger.error(err); };
};
