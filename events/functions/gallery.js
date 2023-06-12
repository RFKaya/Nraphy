module.exports = async (client, message, gallery) => {

  try {

    //Mesaj sahibi kanalları yönet yetkisine sahip değilse
    if (message.channel.permissionsFor(message.member).has("ManageChannels")) return;

    //Mesaj eklenti içeriyormiyorsa
    if (message.attachments.size) return;

    //Mesajda bağlantılı bir eklenti yoksa
    if (message.content.match(/\bhttps?:\/\/\S+/gi)?.find(url =>
      url.endsWith(".png") ||
      url.endsWith(".jpg") ||
      url.endsWith(".mp4") ||
      url.endsWith(".mp3")
    )) return;

    //let repliedMessage;
    //if (message.reference) await message.channel.messages.fetch(message.reference.messageId).then(repliedMsg => repliedMessage = repliedMsg);

    //Alıntılanmış yoksa ya da alıntılanmış mesajın eklentisi yoksa
    //if (!repliedMessage || repliedMessage.attachments.size == 0) {

    message.delete({ reason: `Nraphy Galeri sistemi.` })
      .catch(e => { });

    //Uyarı Metni
    const userCache = client.userDataCache[message.author.id] || (client.userDataCache[message.author.id] = {});
    if (!userCache?.lastWarn || Date.now() - userCache.lastWarn > 5000) {
      userCache.lastWarn = Date.now();
      message.channel.send({
        content: message.author.toString(),
        embeds: [
          {
            color: client.settings.embedColors.red,
            title: '**»** Bu Kanalda Sadece **Fotoğraf/Video** Paylaşabilirsin!',
            description: `**•** Bu kanal, bir galeri kanalı olarak ayarlanmıştır.`
          }
        ]
      }).then(msg => setTimeout(() => msg.delete().catch(e => { }), 5000));
    }

  } catch (err) { client.logger.error(err); };
};
