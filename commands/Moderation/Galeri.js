module.exports = {
  name: "galeri",
  description: "Belirttiğiniz kanalda sadece Fotoğraf/Video gönderilebilir.",
  usage: "galeri",
  aliases: ["fotoğraf-kanalı", "fotoğrafkanal", "fotoğraf-kanal", " galeri-kanal", "galerikanal", "fotoğraf", "galari"],
  category: "Moderation",
  memberPermissions: ["ManageChannels"],
  botPermissions: ["SendMessages", "EmbedLinks", "ManageMessages"],
  nsfw: false,
  cooldown: false,
  ownerOnly: false,

  async execute(client, message, args, data) {

    let channel = message.mentions.channels.first();

    if (!args[0])
      return message.channel.send({
        embeds: [
          {
            color: client.settings.embedColors.default,
            author: {
              name: `${client.user.username} • Galeri Kanalı Sistemi`,
              icon_url: client.settings.icon,
            },
            fields: [
              {
                name: '**»** Galeri Kanalı Sistemi Ne İşe Yarar?',
                value: `**•** Eğer sistemi bir kanal için aktif ederseniz, belirttiğiniz kanalda sadece fotoğraf veya video paylaşılabilir. Mesajında fotoğraf veya video bulunmuyorsa ve herhangi bir içeriği yanıtlamıyorsan o mesajı otomatik olarak sileceğim.`,
              },
              {
                name: '**»** Galeri Sistemi Hangi Mesajları Silmez?',
                value:
                  //`**•** Bir resim içeren mesaj alıntılandıysa; \n` +
                  `**•** Mesajı gönderen kişi **Kanalları Yönet** yetkisine sahipse o mesaj silinmez.`,
              },
              {
                name: '**»** Nasıl Açılır?',
                value: `**•** \`${data.prefix}galeri <#kanal>\` yazarak galeri kanalını aktif edebilirsiniz.`,
              },
              {
                name: '**»** Nasıl Kapatılır?',
                value: `**•** \`${data.prefix}galeri Sıfırla\` yazarak galeri sistemini kapatabilirsiniz.`,
              },
              {
                name: '**»** Ek Not',
                value:
                  `**•** Galeri kanallarında Bağlantı-Engel sistemi muaf tutulur.`,
              },
            ],
          }
        ]
      });

    if (args[0].toLocaleLowerCase('tr-TR') === "sıfırla" || args[0].toLocaleLowerCase('tr-TR') === 'kapat') {

      if (!data.guild.gallery) { //db.has(`Galeri_${message.guild.id}`)
        return message.channel.send({
          embeds: [
            {
              color: client.settings.embedColors.red,
              title: '**»** **Galeri** Sistemi Zaten Kapalı!',
              description: `**•** Açmak için \`${data.prefix}galeri <Kanal>\` yazabilirsin.`
            }
          ]
        });

      } else {

        //db.delete(`Galeri_${message.guild.id}`);
        data.guild.gallery = undefined;
        await data.guild.save();

        message.channel.send({
          embeds: [
            {
              color: client.settings.embedColors.green,
              title: '**»** **Galeri** Sistemi Başarıyla Kapatıldı!',
              description: `**•** Tekrar açmak için \`${data.prefix}galeri <Kanal>\` yazabilirsin.`
            }
          ]
        });

      }
    } else if (channel) {

      //db.set(`Galeri_${message.guild.id}`, channel.id)
      data.guild.gallery = channel.id;
      await data.guild.save();

      message.channel.send({
        embeds: [
          {
            color: client.settings.embedColors.green,
            title: '**»** **Galeri** Sistemi Başarıyla Ayarlandı!',
            description: `**•** Artık ${channel} kanalında Fotoğraf/Video harici mesaj atıldığında silinecek.`
          }
        ]
      });

    } else {

      message.channel.send({
        embeds: [
          {
            color: client.settings.embedColors.red,
            title: '**»** Eksik veya Hatalı Bir Giriş Yaptın!',
            fields: [
              {
                name: '**»** Kanal Ayarlamak İçin',
                value: `**•** \`${data.prefix}galeri #galeri\``,
              },
              {
                name: '**»** Galeri Sistemini Kapatmak İçin',
                value: `**•** \`${data.prefix}galeri Kapat\``,
              },
            ],
          }
        ]
      });

    }
  }
};