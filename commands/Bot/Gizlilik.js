module.exports = {
  interaction: {
    name: "gizlilik",
    description: "Verilerinizin nasıl işleneceği ve gizliliğiniz hakkında bilgi.",
    options: []
  },
  aliases: [],
  category: "Bot",
  memberPermissions: [],
  botPermissions: ["SendMessages", "EmbedLinks"],
  nsfw: false,
  cooldown: false,
  ownerOnly: false,

  async execute(client, interaction, data) {

    interaction.reply({
      embeds: [
        {
          color: client.settings.embedColors.default,
          author: {
            name: `${client.user.username} • Gizlilik Politikamız`,
            icon_url: client.settings.icon,
          },
          fields: [
            {
              name: '**»** Nraphy\'nin Sakladığı Veriler',
              value:
                `**•** **1)** Nraphy'le ilgili kullanıcı verileri\n` +
                `**=>** Nraphy hakkındanız, yorumlarınız, NraphyCoin miktarınız, Nraphy Premium aboneliğinizle ilgili detaylarınız gibi size özel profil kayıtları\n` +
                `**=>** Nraphy'i tetiklemenize sebep olan içerik ve detayları (Kullanılan Nraphy komutunun içeriği gibi unsurlar)\n\n` +

                `**•** **2)** Nraphy'le ilgili sunucu verileri\n` +
                `**=>** Sayaç, Oto-Rol, Davet Sistemi gibi sistemlerin ayarları ve ihtiyaç duyuldukça saklanan bu sistemle etkileşime geçmiş ya da başka üyeler tarafından etkileşime geçirilmiş üyelerin ID'leri\n` +
                `**=>** Nraphy'nin tetiklenmesine sebep olan içerik ve detayları (Kelime Oyunu gibi oyunlardaki kullanıcıların istatistikleri, üyelerin uyarıları gibi Nraphy ile ilgili unsurlar)`
            },
            {
              name: '**»** Saklanan Verilerin Tutulma Süreleri',
              value:
                `**•** Saklanan veriler, siz silmediğiniz veya silinmesini talep etmediğiniz sürece silinmez.`
            },
            {
              name: '**»** Gizliliğinizi İhlal Edebilecek Verilerin Gizliliği',
              value:
                `**•** Gizliliğinizi ihlal edebilme potansiyeli taşıyan verileriniz 3. kişilerle paylaşılmaz ve satılmaz. Ancak yaş verileri gibi veriler sizin rızanız dahilinde diğer üyeler tarafından görüntülenebilir veya diğer üyelere gizlenebilir. Onlar haricinde tamamen Nraphy'nin gelişimi ve istatistik amaçlı kullanılır. Ayrıca aşağıdaki maddeye de göz atabilirsiniz.`,
            },
            {
              name: '**»** Saklanan Veriler Nerede Kullanılacak?',
              value:
                `**•** İlgili komutlarda ve sistemlerde gerekli olduğunda sunulmak için saklanır. Ek olarak Nraphy'i geliştirmemize ve size daha iyi bir hizmet sunmamıza yardımcı olmak amaçlı istatistik sağlama, hata giderimi ve kişiselleştirilmiş hizmet gibi konularda da kullanılabilir. Bazı istatistiklerde **X sistemini kullanan sunucu sayısı** gibi şekillerle anonim bir şekilde paylaşılabilir.`,
            },
            {
              name: '**»** Verilerinizi Veritabanından Temizlenme Yolları',
              value:
                `**•** Verilerinizin Nraphy'den silinmesini isterseniz [Destek Sunucumuza](https://discord.gg/VppTU9h) gelip belirtebilirsiniz. Yetkili ekibimiz yardımcı olacaktır. (Sunucu verilerini içeren veriler için ilgili sunucunun sahibinin de onayı gerekmektedir. Ayrıca Nraphy yönetimi tarafından verilen Nraphy hizmetlerinden yasaklamalarla ilgili olarak saklanan verilerin silinmesi mümkün değildir.)`,
            },
            {
              name: '**»** Son Güncelleme',
              value:
                `**•** 1 Eylül 2022`,
            },
          ],
          /*timestamp: new Date(),
          footer: {
            text: `${(interaction.type == 2) ? interaction.user.username : interaction.author.username} tarafından istendi.`,
            icon_url: (interaction.type == 2) ? interaction.user.displayAvatarURL({ size: 1024 }) : interaction.author.displayAvatarURL({ size: 1024 }),
          },*/
        }
      ],
    });

  }
};