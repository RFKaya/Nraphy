const Discord = require("discord.js");
const { ButtonBuilder } = require('discord.js');
const { roleChecker, messageChecker } = require("../../modules/Functions");

module.exports = {
  interaction: {
    name: "buton-rol",
    description: "Butona tıklayarak rol alabileceğiniz sistem. (Beta)",
    options: [
      {
        name: "bilgi",
        description: "Buton rol sistemiyle ilgili tüm bilgiler.",
        type: 1,
        options: []
      },
      {
        name: "oluştur",
        description: "Buton rol mesajı oluşturur.",
        type: 1,
        options: [
          {
            name: "rol",
            description: "Butona tıklanınca verilecek rolü seç.",
            type: 8,
            required: true
          },
          {
            name: "başlık",
            description: "Buton rol mesajının başlığını belirt.",
            type: 3,
            required: false
          },
          {
            name: "kanal",
            description: "Buton rol mesajının oluşturulacağı kanalı seç.",
            type: 7,
            required: false
          },
        ]
      },
      {
        name: "düzenle",
        description: "Buton rol mesajındaki öğeleri düzenler.",
        type: 2,
        options: [
          {
            name: "rol",
            description: "Butona tıklanınca verilecek rolü seç.",
            type: 1,
            options: [
              {
                name: "işlem",
                description: "Seçeceğin rol mesajdan kaldırılsın mı/eklensin mi?",
                choices: [
                  { name: "Ekle", value: "ekle" },
                  { name: "Kaldır", value: "kaldir" }
                ],
                type: 3,
                required: true
              },
              {
                name: "mesaj",
                description: "İşlem yapılacak buton rol mesajının ID'sini gir.",
                type: 3,
                required: true
              },
              {
                name: "rol",
                description: "Butona tıklanınca verilecek rolü seç.",
                type: 3,
                required: true
              },
            ]
          },
          {
            name: "başlık-belirle",
            description: "Buton rol mesajının başlığını belirlemenizi sağlar.",
            type: 1,
            options: [
              {
                name: "mesaj",
                description: "İşlem yapılacak buton rol mesajının ID'sini gir.",
                type: 3,
                required: true
              },
              {
                name: "başlık",
                description: "Buton rol mesajının başlığını belirt.",
                type: 3,
                required: true
              },
            ]
          },
          {
            name: "başlık-temizle",
            description: "Buton rol mesajının başlığını temizlemenizi sağlar.",
            type: 1,
            options: [
              {
                name: "mesaj",
                description: "İşlem yapılacak buton rol mesajının ID'sini gir.",
                type: 3,
                required: true
              },
            ]
          },
        ]
      },
    ]
  },
  interactionOnly: true,
  aliases: ["butonrol", "tepkirol", "tepki-rol", "emojirol", "emoji-rol"],
  category: "Moderation",
  memberPermissions: ["ManageRoles"],
  botPermissions: ["ViewChannel", "SendMessages", "EmbedLinks", "ManageRoles"],
  nsfw: false,
  cooldown: 5000,
  ownerOnly: false,

  async execute(client, interaction, data) {

    const getSubcommand = interaction.options.getSubcommandGroup(false);
    const getCommand = interaction.options.getSubcommand();

    if (getCommand == "bilgi") {

      interaction.reply({
        embeds: [
          {
            color: client.settings.embedColors.default,
            author: {
              name: `${client.user.username} • Buton Rol Sistemi (Beta)`,
              icon_url: client.settings.icon,
            },
            fields: [
              {
                name: '**»** Ne İşe Yarar?',
                value: `**•** Sunucudaki üyeler buton rol mesajındaki butonlara tıklayarak kendilerine rol alır ya da rolünü siler.`,
              },
              {
                name: '**»** Buton Rol Mesajı Nasıl Oluşturulur?',
                value: `**•** \`/buton-rol Oluştur\` yazıp, mesajın gönderilmesini istediğin kanalı ve verilmesini istediğin rolü seçerek oluşturabilirsin.`,
              },
              {
                name: '**»** Aynı Mesaj İçerisinde Birden Fazla Buton Nasıl Oluştururuz?',
                value: `**•** Öncelikle yukarıdaki madde ile bir buton rol mesajı oluşturmalısınız. Ardından \`/buton-rol Düzenle Rol Ekle\` yazıp, gerekli kısımları doldurarak ilgili mesaja buton roller ekleyebilirsiniz.`,
              },
              {
                name: '**»** Aynı Mesaj İçerisindeki Buton Rol Limiti Nedir?',
                value: `**•** Şimdilik, bir buton rol mesajında en fazla 5 adet buton rol bulunabilir. Yakında güncelleme ile bu limit arttırılacaktır.`,
              },
              {
                name: '**»** Başlık Nasıl Belirlenir/Temizlenir?',
                value: `**•** Başlık belirleme için buton rol mesajını oluştururken Interaction opsiyonlarından başlığı girerek ekleyebilirsiniz. Ya da \`/buton-rol düzenle başlık-belirle\` komutuyla da daha sonra olarak başlığı belirleyebilirsiniz. \`/buton-rol düzenle başlık-temizle\` komutuyla da belirlediğiniz başlığı temizleyebilirsiniz.`,
              },
              {
                name: '**»** Buton Rol Mesajındaki Bir Rolü Nasıl Silebilirim? / Tüm Butonlarıyla Birlikte Nasıl İptal Ederim?',
                value: `**•** Bir rolü aralarından silmek için \`/buton-rol Düzenle Rol Kaldır\` yazıp, gerekli kısımları doldurarak ilgili mesajdaki o rolün butonunu kaldırabilirsiniz. Ayrıca sileceğiniz butonun tıklanma sayısı, toplam tıklamadan silinecektir. Buton rol mesajını iptal etmek için ise buton rol mesajını silebilirsiniz.`,
              },
              {
                name: '**»** Butona Tekrar Tıklarsam Rolü Geri Alır mı?',
                value: `**•** Evet, tekrar tıklayarak rolü üzerinizden atabilirsiniz. Bu özelliği şimdilik kapatamazsınız. Ancak en kısa sürede güncelleme ile yapılacaktır.`,
              },
              {
                name: '**»** Toplam Tıklama Miktarı Neden Eksik Gösteriyor?',
                value: `**•** Toplam tıklama sayısı belirli aralıklarla (Çok kısa) güncellenmektedir. Ayrıca 10 tıklamanın üstünde ise optimizasyon amaçlı olarak **10+**, **20+** gibi sayılarla gösterilmektedir. Yani bir hata yok.`,
              },
              {
                name: '**»** Güncelleme Planı',
                value:
                  `**•** :x: Bir mesajdaki buton rol limiti arttırılacak.\n` +
                  `**•** :x: Bir buton rol mesajından ayarlanan limit kadar sayıda rol alınabilecek.\n` +
                  `**•** :x: Butona tıklayınca rolü geri alması açılıp kapatılabilecek.`,
              },
            ],
          }
        ]
      });

    } else if (getCommand == "oluştur") {

      const getRole = interaction.options.getRole("rol");
      const getTitle = interaction.options.getString("başlık");
      const getChannel = interaction.options.getChannel("kanal") || interaction.channel;

      if (getChannel.type !== 0)
        return interaction.reply({
          embeds: [
            {
              color: client.settings.embedColors.red,
              title: `**»** Geçerli Bir Kanal Belirtmelisin!`,
              description: `**•** Belirttiğin kanal, oda veya kategori olmamalı. Sadece yazı kanalı.`,
            }
          ]
        });

      if (await roleChecker(interaction, getRole)) return;

      if (Object.keys(data.guild.buttonRole || {}).length >= 50)
        return interaction.reply({
          embeds: [
            {
              color: client.settings.embedColors.red,
              title: '**»** Bu Sunucuda Çok Fazla Buton Rol Mesajı Var!',
              description:
                `**•** Lütfen \`/ayarlar\` komutunu kullanarak pasif buton rolleri silin.\n` +
                `**•** Sorun çözülmez ise destek ekibimizle iletişime geçin.`
            }
          ],
          components: [
            {
              type: 1, components: [new Discord.ButtonBuilder().setLabel('Destek Sunucusu').setURL(`https://discord.gg/QvaDHvuYVm`).setStyle('Link')]
            },
          ]
        });

      await interaction.deferReply();

      let message = await interaction.guild.channels.cache.get(getChannel.id).send({
        content: "Buton Rol sistemini aktif etmek için butona tıkla!",
        components: [
          {
            type: 1, components: [
              new Discord.ButtonBuilder()
                .setLabel('Aktif Et!')
                .setCustomId("0")
                .setStyle('Primary')
            ]
          },
        ]
      });

      if (!data.guild.buttonRole) data.guild.buttonRole = {};
      data.guild.buttonRole[message.id] = {
        channelId: getChannel.id,
        title: getTitle || null,
        buttons: {
          '0': {
            roleId: getRole.id,
            clickAmount: 0
          }
        },
        lastUpdate: {
          date: null,
          totalClicks: null
        },
        lastClicker: null,
      };
      data.guild.markModified('buttonRole');
      await data.guild.save();

      interaction.editReply({
        embeds: [
          {
            color: client.settings.embedColors.green,
            author: {
              name: `${client.user.username} • Buton-Rol Sistemi (Beta)`,
              icon_url: client.settings.icon,
            },
            title: '**»** Buton Rol Başarıyla Oluşturuldu!',
            url: message.url,
            description: '**•** Buton Rol sistemi hakkında bilgi almak isterseniz `/buton-rol Bilgi` yazabilir ya da destek sunucumuza gelebilirsin.',
            fields: [
              {
                name: '**»** Rol',
                value: `**•** ${getRole}`,
              },
              {
                name: '**»** Başlık',
                value: `**•** ${getTitle || "Başlık belirtilmedi."}`,
              },
              {
                name: '**»** Kanal',
                value: `**•** ${getChannel}`,
              },
              {
                name: '**»** Mesaj',
                value: `**•** Mesaja gitmek için bu Embed'ın başlığına tıkla!`,
              },
            ],
          }
        ],
        components: [
          {
            type: 1, components: [new Discord.ButtonBuilder().setLabel('Destek Sunucusu').setURL(`https://discord.gg/QvaDHvuYVm`).setStyle('Link')]
          },
        ]
      });

    } else if (getSubcommand == "düzenle") {

      if (!data.guild.buttonRole)
        return interaction.reply({
          embeds: [
            {
              color: client.settings.embedColors.red,
              title: '**»** Hiç Buton Rol Mesajı Oluşturulmamış Ki!',
              description:
                `**•** Hemen \`/buton-rol Oluştur\` komutuyla bir buton rol mesajı oluşturmalısın.\n` +
                `**•** "Nasıl yapacağım anlamadım ki?" diyorsan [destek sunucumuza](https://discord.gg/QvaDHvuYVm) katılabilirsin.`
            }
          ],
          components: [
            {
              type: 1, components: [new ButtonBuilder().setLabel('Destek Sunucusu').setURL("https://discord.gg/VppTU9h").setStyle('Link')]
            },
          ]
        });

      if (getCommand == "rol") {

        const getOperation = interaction.options.getString("işlem");
        const getButtonRoleMessageId = interaction.options.getString("mesaj");
        const getRole = interaction.options.getString("rol");

        var buttonRoleMessage = data.guild.buttonRole[getButtonRoleMessageId];

        if (getOperation == "ekle") {

          if (!buttonRoleMessage)
            return interaction.reply({
              embeds: [
                {
                  color: client.settings.embedColors.red,
                  title: '**»** Mesajı Bulamadım!',
                  description:
                    `**•** Doğru bir mesaj ID'si belirttiğinden emin ol.\n` +
                    `**•** Bir buton rol mesajı oluşturmadıysan \`/buton-rol Oluştur\` ile oluşturabilirsin.`
                }
              ]
            });

          if (Object.keys(buttonRoleMessage.buttons || {}).length >= 5)
            return interaction.reply({
              embeds: [
                {
                  color: client.settings.embedColors.red,
                  title: '**»** Bir Mesaja En Fazla 5 Buton Rol Ekleyebilirsin!',
                  description: `**•** İstersen \`/buton-rol Oluştur\` ile yeni buton rol mesajı oluşturabilirsin.`
                }
              ]
            });

          for (let button in buttonRoleMessage.buttons) {
            let buttonData = await buttonRoleMessage.buttons[button];
            if (buttonData.roleId == getRole) {
              return interaction.reply({
                embeds: [
                  {
                    color: client.settings.embedColors.red,
                    title: '**»** Bu Rolü Veren Bir Buton Zaten Var!',
                    description: `**•** Farklı bir rol belirtmelisin.`
                  }
                ]
              });
            }
          }

          if (await roleChecker(interaction, getRole)) return;

          await interaction.deferReply();

          for (
            var i = 0;
            !buttonRoleMessage || i < Object.keys(buttonRoleMessage.buttons || {}).length;
            i++
          ) { }

          data.guild.buttonRole[getButtonRoleMessageId].lastUpdate = {
            date: null,
            totalClicks: null
          };
          data.guild.buttonRole[getButtonRoleMessageId].buttons[i] = {
            roleId: getRole,
            clickAmount: 0
          };
          data.guild.markModified('buttonRole');
          await data.guild.save();

          interaction.guild.channels.cache.get(buttonRoleMessage.channelId).messages.fetch(getButtonRoleMessageId)
            .then(message => {
              message.edit({
                content: "Buton rol sisteminin bu mesajında düzenleme yapıldı! Düzenlemeyi aktif etmek için butona tıkla!",
                embeds: [],
                components: [
                  {
                    type: 1, components: [
                      new Discord.ButtonBuilder()
                        .setLabel('Aktif Et!')
                        .setCustomId("0")
                        .setStyle('Primary')
                    ]
                  },
                ]
              });
            });

          interaction.editReply("tamamdir");

        } else if (getOperation == "kaldir") {

          interaction.reply("kaldırma yok simdilick");

        }

      } else if (getCommand == "başlık-belirle") {

        const getButtonRoleMessageId = interaction.options.getString("mesaj");
        const getTitle = interaction.options.getString("başlık");

        var buttonRoleMessage = data.guild.buttonRole[getButtonRoleMessageId];

        if (!buttonRoleMessage)
          return interaction.reply({
            embeds: [
              {
                color: client.settings.embedColors.red,
                title: '**»** Mesajı Bulamadım!',
                description:
                  `**•** Doğru bir mesaj ID'si belirttiğinden emin ol.\n` +
                  `**•** Bir buton rol mesajı oluşturmadıysan \`/buton-rol Oluştur\` ile oluşturabilirsin.`
              }
            ]
          });

        if (!await messageChecker(interaction, getTitle, '/buton-rol Düzenle Başlık-Belirle Burcunu seç!')) return;

        data.guild.buttonRole[getButtonRoleMessageId].title = getTitle;
        data.guild.buttonRole[getButtonRoleMessageId].lastUpdate = {
          date: null,
          totalClicks: null
        };
        data.guild.markModified('buttonRole');
        await data.guild.save();

        interaction.guild.channels.cache.get(buttonRoleMessage.channelId).messages.fetch(getButtonRoleMessageId)
          .then(message => {
            message.edit({
              content: "Buton rol sisteminin bu mesajında düzenleme yapıldı! Düzenlemeyi aktif etmek için butona tıkla!",
              embeds: [],
              components: [
                {
                  type: 1, components: [
                    new Discord.ButtonBuilder()
                      .setLabel('Aktif Et!')
                      .setCustomId("0")
                      .setStyle('Primary')
                  ]
                },
              ]
            });
          });

        return interaction.reply("Başlık belirlendi");

      } else if (getCommand == "başlık-temizle") {

        return interaction.reply("başlık temizleme şimdi yok");

      }
    }

  }
};