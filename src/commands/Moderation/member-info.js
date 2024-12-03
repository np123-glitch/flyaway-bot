const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');
const getUserModel = require('../../Schemas/User');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('member-info')
        .setDescription('Get information about a member.')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('The user to get information about.')
                .setRequired(true)
        ),
    async execute(interaction) {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) return await interaction.reply({ content: 'You must have administrator permissions to use this command!', ephemeral: true });

        const targetUser = interaction.options.getUser('user');
        const User = getUserModel();

        try {
            const user = await User.findOne({ discordId: targetUser.id });

            if (!user) {
                return interaction.reply({ content: 'User not found in the database. Make sure they have used /verify.', ephemeral: true });
            }

            const member = interaction.guild.members.cache.get(targetUser.id);
            const roles = member.roles.cache
                .filter(role => role.name !== '@everyone') // Exclude @everyone
                .map(role => `<@&${role.id}>`)
                .join(', ');


            const embed = new EmbedBuilder()
                .setColor('#0099ff')
                .setTitle(`Member Information for ${user.fullName}`)
                .setThumbnail(targetUser.displayAvatarURL())
                .addFields(
                    { name: 'VATSIM ID', value: user.vatsimId || 'N/A', inline: true },
                    { name: 'Email', value: user.email || 'N/A', inline: true },
                    { name: 'Full Name', value: user.fullName || 'N/A', inline: true },
                    { name: 'Pilot Rating', value: user.pilotRating || 'N/A', inline: true },
                    { name: 'ATC Rating', value: user.ratingShort || 'N/A', inline: true },
                    { name: 'Discord Username', value: targetUser.username, inline: true },
                    { name: 'Discord ID', value: targetUser.id, inline: true },
                    { name: 'Roles', value: roles || 'No Roles', inline: false }
                );

            await interaction.reply({ embeds: [embed] });

        } catch (error) {
            console.error('Error in /member-info:', error);
            interaction.reply({ content: 'An error occurred while fetching member information.', ephemeral: true });
        }
    },
};
