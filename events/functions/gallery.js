module.exports = async (client, message, gallery) => {

  try {

    if (
      //Mesaj sahibi kanalları yönet yetkisine sahip değilse
      !message.channel.permissionsFor(message.member).has("ManageChannels") &&

      //Mesaj eklenti içeriyormiyorsa
      !message.attachments.size &&

      //Mesajda bağlantılı bir eklenti yoksa
      !message.content.match(/\bhttps?:\/\/\S+/gi)?.find(url =>
        url.endsWith(".png") ||
        url.endsWith(".jpg") ||
        url.endsWith(".mp4") ||
        url.endsWith(".mp3"))
    ) {

      message.delete({ reason: `Nraphy • Galeri Sistemi` })
        .catch(() => { });

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

    } else {

      if (
        //Otomatik alt başlıklar açıksa
        gallery.autoCreateThreads &&

        //Mesaja ek varsa veya mesajda bağlantılı bir eklenti varsa
        message.attachments.size || message.content.match(/\bhttps?:\/\/\S+/gi)?.find(url =>
          url.endsWith(".png") ||
          url.endsWith(".jpg") ||
          url.endsWith(".mp4") ||
          url.endsWith(".mp3"))
      ) {

        const userCache = client.userDataCache[message.author.id] || (client.userDataCache[message.author.id] = {});
        if (!userCache?.lastWarn || Date.now() - userCache.lastWarn > 500) {
          userCache.lastWarn = Date.now();
          await message.startThread({ name: "Nraphy • Galeri Sistemi" });
        }

      }

    }

  } catch (err) { client.logger.error(err); };
};
