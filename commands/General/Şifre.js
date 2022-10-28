module.exports = {
  name: "şifre",
  description: "Rastgele bir şifre verir.",
  usage: "şifre <Uzunluk>",
  aliases: ["sifre", "şifre-oluştur", "sifreolustur", "sifreoluştur", "sifre-oluştur", "şifre-olustur", "şifreoluştur", "şifreolustur", "rastgele-sifre", "rastgelesifre", "rastgele-şifre"],
  category: "General",
  memberPermissions: [],
  botPermissions: ["SendMessages", "EmbedLinks"],
  nsfw: false,
  cooldown: false,
  ownerOnly: false,

  async execute(client, message, args, data) {

    let uzunluk = args[0];

    if (!uzunluk)
      return message.channel.send({
        embeds: [
          {
            color: client.settings.embedColors.red,
            title: '**»** Şifrenin Kaç Karakter Olacağını Belirtmelisin!',
            description: `**•** Örnek kullanım: \`${data.prefix}şifre 32\``
          }
        ]
      });


    let x = /(-)/;
    if (isNaN(uzunluk) || uzunluk.includes(',') || uzunluk.includes('.') || uzunluk.match(x))
      return message.channel.send({
        embeds: [
          {
            color: client.settings.embedColors.red,
            title: '**»** Geçerli Bir Uzunluk Belirtmelisin!',
            description: `**•** Örnek kullanım: \`${data.prefix}şifre 32\``
          }
        ]
      });

    if (uzunluk <= 0)
      return message.channel.send({
        embeds: [
          {
            color: client.settings.embedColors.red,
            title: '**»** ŞİFREN 0 HANELİ OLAMAZ!',
            description: `**•** BAZEN BENİ SİNİR ETMEK İÇİN BENİ KULLANDIĞINIZI DÜŞÜNÜYORUM... :rage:`
          }
        ]
      });

    if (uzunluk > 500)
      return message.channel.send({
        embeds: [
          {
            color: client.settings.embedColors.red,
            title: '**»** Şifren Çoook Uzun!',
            description: `**•** En fazla **500** karakterli şifre oluşturabilirsin.`
          }
        ]
      });

    function generatePassword(length) {
      var charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789.!@$#&%",
        retVal = "";
      for (var i = 0, n = charset.length; i < length; ++i) {
        retVal += charset.charAt(Math.floor(Math.random() * n));
      }
      return retVal;
    }

    var şifre = generatePassword(parseInt(uzunluk));

    /*var şifre = password.generate({
      length: `${uzunluk}`,
      numbers: true
    });*/

    const cevaplar = [
      "Tebrikler! bizden bir adet çok gizli şifre kazandınız!",
      "Bu şifreyi FBI ve CIA bile gelse çözemez.",
      "Merak etme hesabını çalmam. 😂",
      "Ultra mega gizli şifren hazır.",
      "Bunu senin için fırından yeni çıkardım.",
      "Sıcacık ve taptaze şifren hazır.",
      "Şifreni oluşturdum!",
      "Sen bu şifreyi kullan da senin hesabına sızma yağ gibi sızayım.",
      "Al bakalım çocuk adam."
    ];

    var cevap = cevaplar[Math.floor(Math.random() * cevaplar.length)];

    message.channel.send({
      embeds: [
        {
          color: client.settings.embedColors.default,
          title: `**»** ${cevap}`,
          description: `**•** ${şifre}`,
        }
      ]
    });

  }
};