const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('vsp')
        .setDescription('Removes anything after and including "|" from nicknames (except admins)'),
    async execute(interaction) {
        const adminRole = interaction.guild.roles.cache.find(role => role.name === 'Admin');
        if (!adminRole) {
            return interaction.reply({ content: 'Admin role not found.  This command will affect all users.', ephemeral: true });
        }

        const members = await interaction.guild.members.fetch();

        await interaction.deferReply({ ephemeral: true });

        let updatedCount = 0;

        for (const member of members.values()) {
            // Skip members with the admin role
            if (member.roles.cache.has(adminRole.id)) {
                continue;
            }

            const currentNickname = member.nickname || member.user.username;
            const pipeIndex = currentNickname.indexOf('|');

            if (pipeIndex !== -1) {
                try {
                    await member.setNickname(currentNickname.substring(0, pipeIndex).trim());
                    updatedCount++;
                } catch (error) {
                    console.error(`Failed to update nickname for ${member.user.tag}: ${error}`);
                }
            }
        }

        await interaction.editReply(`Updated ${updatedCount} nicknames.`);
    },
};

