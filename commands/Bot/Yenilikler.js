const humanize = require("humanize-duration");
const random = require("random");

module.exports = {
  interaction: {
    name: "yenilikler",
    description: "Nraphy'e gelen en sonki güncellemenin yeniliklerini listeler.",
    options: [],
  },
  interactionOnly: true,
  aliases: ["yenilik", "güncelleme", "güncellemeler"],
  category: "Bot",
  memberPermissions: [],
  botPermissions: ["SendMessages", "EmbedLinks", "ReadMessageHistory"],
  nsfw: false,
  cooldown: false,
  ownerOnly: false,

  async execute(client, interaction, data) {

    await interaction.deferReply();

    var releaseDate = client.settings.updateDate;
    var embeds = [{
      color: client.settings.embedColors.default,
      author: {
        name: `${client.user.username} • Yenilikler`,
        icon_url: client.settings.icon,
      },
      title: `**»** Qurvettiiii (<t:${(releaseDate / 1000).toFixed(0)}:f>)`,
      description:
        `» Büyük Harf Engel Sistemi Eklendi! 
      • Sunucu genelinde veya seçili kanallarda çalıştırabilir, muaf rol veya muaf kanal seçebilirsiniz. 
      • Bildiğimiz büyük harfli mesajları blokluyo işte. Büyük harf oranı da seçebiliyorsunuz.
      • Detaylı bilgi için /büyük-harf-engel Bilgi yazabilirsiniz.
      
      » Yenilikler! 
      • Kelime Oyunu'nda istatistikleri sıfırlama eklendi. Sıfırladıktan sonra istatistiklerin bir kopyasını txt olarak iletiyor. (Fikri için @frudotz'a teşekkürler)
      • Sunucu Kur'a emojiler eklendi.`,
      footer: {
        text: `Öneri ve şikayetlerinizi '/bildiri' komutuyla yapabilirsiniz. • ${humanize(Date.now() - releaseDate, { language: "tr", round: true, largest: 1 })} önce yayınlandı.`,
        icon_url: interaction.user.displayAvatarURL({ dynamic: true }),
      },
    }];

    /*var userData = await client.database.fetchUser(interaction.user.id);
    if (userData.readDateOfChanges < releaseDate) {

      userData.readDateOfChanges = Date.now()
      userData.markModified('readDateOfChanges');
      await userData.save()

      var hediyeMiktar = random.int(250, 750)
      userData.NraphyCoin += hediyeMiktar;
      userData.markModified('NraphyCoin');
      await userData.save()

      embeds.push({
        color: client.settings.embedColors.default,
        title: "**»** Yenilikleri Okuma Bonusu Kazandın! 🎁",
        description: `**•** Hesabına \`${new Intl.NumberFormat().format(hediyeMiktar)} NraphyCoin\` eklendi. 🎉`
      })

    }*/

    interaction.editReply({
      embeds: embeds
    });

  }
};