module.exports = {
  name: "matematik",
  description: "Rastgele matematik işlemi verir.",
  usage: "matematik",
  aliases: ["mat", "math"],
  category: "Games",
  memberPermissions: [],
  botPermissions: ["SendMessages", "EmbedLinks"],
  nsfw: false,
  cooldown: 3000,
  ownerOnly: false,

  async execute(client, message, args, data) {
    let islem = [];
    let sonuç;

    const topcikbelli = Math.floor(Math.random() * (3 - 1)) + 1;

    if (topcikbelli === 1) islem = "-";
    if (topcikbelli === 2) islem = "+";

    const rakam1 = parseInt((Math.random() * (100 - 1)).toFixed());
    const rakam2 = parseInt((Math.random() * (100 - 1)).toFixed());

    if (islem == "-") sonuç = rakam1 - rakam2;
    if (islem == "+") sonuç = rakam1 + rakam2;

    const fixedlisonuç = sonuç;

    //await message.react('👌')

    await message.channel.send({
      embeds: [
        {
          color: client.settings.embedColors.default,
          title: '**»** Aşağıdaki Soruyu **7 Saniye** içinde Cevaplamalısın!',
          description: `\`\`\`${rakam1} ${islem} ${rakam2}\`\`\``,
        }
      ]
    });

    let uwu = false;
    while (!uwu) {
      const filter = m => m.author.id == message.author.id;
      const response = await message.channel.awaitMessages({ filter, max: 1, time: 7000 });

      if (!response.first())
        return message.channel.send({
          embeds: [
            {
              color: client.settings.embedColors.red,
              title: '**»** Süren Doldu!',
              description: `**•** Doğru cevap: **${fixedlisonuç}**`
            }
          ]
        });

      const choice = response.first().content;

      if (isNaN(choice))
        return message.channel.send({
          embeds: [
            {
              color: client.settings.embedColors.red,
              title: '**»** Sadece Sayı Belirtmelisin!',
              description: `**•** Hem sence cevabın böyle olması mümkün mü? Sadece merak ettim.`
            }
          ]
        });

      if (choice != fixedlisonuç)
        return message.channel.send({
          embeds: [
            {
              color: client.settings.embedColors.red,
              title: '**»** Yanlış Cevap!',
              description: `**•** Doğru cevap **${fixedlisonuç}** olmalıydı.`
            }
          ]
        });

      //if (choice !== fixedlisonuç) {}
      if (choice == fixedlisonuç) uwu = true;
    }

    await message.channel.send({
      embeds: [
        {
          color: client.settings.embedColors.green,
          title: '**»** Tebrikler!',
          description: `**•** Doğru cevap! :tada:`
        }
      ]
    });

  }
};