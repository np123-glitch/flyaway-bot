const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('vsp')
    .setDescription('Add "| vSP" to all vStudent Pilot nicknames'),
  async execute(interaction) {
    const vStudentRole = interaction.guild.roles.cache.get('1260981907227807754');
    if (!vStudentRole) {
      return interaction.reply({ content: 'vStudent Pilot role not found.', ephemeral: true });
    }

    await interaction.deferReply({ ephemeral: true });

    let updatedCount = 0;
    const members = await vStudentRole.members;

    for (const [memberId, member] of members) {
      const currentNickname = member.nickname || member.user.username;
      if (!currentNickname.includes('| vSP')) {
        try {
          await member.setNickname(`${currentNickname} | vSP`);
          updatedCount++;
        } catch (error) {
          console.error(`Failed to update nickname for ${member.user.tag}: ${error}`);
        }
      }
    }

    await interaction.editReply(`Updated ${updatedCount} nicknames with "| vSP".`);
  },
};
