module.exports = async (client, queue) => {

  try {

    queue.volume = 80;

  } catch (err) { client.logger.error(err); };
};
