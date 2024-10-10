const { SlashCommandBuilder } = require('discord.js')


module.exports = {
  data: new SlashCommandBuilder()
.setName('setup-nickname')
.setDescription('Setup your nickname')
  .addStringOption(options => options.setName('firstname').setDescription('Your First Name').setRequired(true))
  .addStringOption(options => options.setName('lastname').setDescription('Your Last name or last name initial ').setRequired(true)),


  async execute(interaction) {
    const firstName = interaction.options.getString('firstname');
    const initials = interaction.options.getString('lastname');
    const nickname = `${firstName} ${lastname} `.trim();

    try {
      await interaction.member.setNickname(nickname);
      await interaction.reply({content: `Your nickname has been changed to: **${nickname}**` , ephemeral: true })
    } catch (error) {
      console.error(error);
      await interaction.reply('There was an error trying to change your nickname!');
    }
  },
};