const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const https = require('https');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('faq')
    .setDescription('Displays the FAQ from FlyAway Virtual'),
  
  async execute(interaction) {
    https.get('https://flyawayvirtual.com/api/faq', (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const faqData = JSON.parse(data);
          const embeds = createFAQEmbeds(faqData);
          interaction.reply({ embeds: embeds, ephemeral: true });
        } catch (error) {
          console.error('Error parsing FAQ data:', error);
          interaction.reply('Sorry, there was an error processing the FAQ data.');
        }
      });
    }).on('error', (error) => {
      console.error('Error fetching FAQ:', error);
      interaction.reply('Sorry, I couldn\'t fetch the FAQ at the moment. Please try again later.');
    });
  },
};

function createFAQEmbeds(faqData) {
  const embeds = [];
  const itemsPerEmbed = 5;

  for (let i = 0; i < faqData.length; i += itemsPerEmbed) {
    const embed = new EmbedBuilder()
      .setColor('#0099ff')
      .setTitle('FlyAway Virtual FAQ')
      .setDescription(`Page ${Math.floor(i / itemsPerEmbed) + 1}`);

    const chunk = faqData.slice(i, i + itemsPerEmbed);
    chunk.forEach((item, index) => {
      embed.addFields(
        { name: `Q${i + index + 1}: ${item.question}`, value: item.answer }
      );
    });

    embeds.push(embed);
  }

  return embeds;
}
