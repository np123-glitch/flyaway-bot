const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js')

module.exports = {
  data: new SlashCommandBuilder()
.setName('verify-hours')
.setDescription('verify how many hours someone has one VATSIM')
.addStringOption(options => options.setName('cid').setDescription('The CID of the user').setRequired(true)),



async execute(interaction) {
  const cid = await interaction.options.getString('cid')
  const button = new ButtonBuilder()
	.setLabel('✅ VERIFY')
	.setURL(`https://stats.vatsim.net/stats/${cid}`)
	.setStyle(ButtonStyle.Link);
  const row = new ActionRowBuilder()
			.addComponents(button);
  

  await interaction.reply ({content: `Click below to go to **VASTIM STATS** page.` , components: [row] , ephemeral: true })
}

}