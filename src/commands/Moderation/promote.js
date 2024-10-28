const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('promote')
        .setDescription('Promote a user to vP1, vP2, vP3, iP1, iP2, or iP3 role.')
        .addUserOption(option => 
            option.setName('user')
                .setDescription('The user to promote')
                .setRequired(true))
        .addStringOption(option => 
            option.setName('role')
                .setDescription('The role to assign')
                .setRequired(true)
                .addChoices(
                    { name: 'vP1', value: 'vP1' },
                    { name: 'vP2', value: 'vP2' },
                    { name: 'vP3', value: 'vP3' },
                    { name: 'iP1', value: 'iP1' },
                    { name: 'iP2', value: 'iP2' },
                    { name: 'iP3', value: 'iP3' },
                )),

    async execute(interaction) {
        const user = interaction.options.getUser('user');
        const role = interaction.options.getString('role');
        const member = await interaction.guild.members.fetch(user.id);

        // Define role ID placeholders for each role
        const roleIds = {
            'vP1': '1289288863478583308',
            'vP2': '1289288943782858752',
            'vP3': '1289289000061763616',
            'iP1': '1289289038485782549',
            'iP2': '1289289119909941248',
            'iP3': '1289289179561463849'
        };

        const newRoleId = roleIds[role]; // Get the role ID based on the selected role
        const promotionsChannelId = '1264403466457972839'; // ID of the promotions channel

        try {
            // Remove old roles: "vStudent Pilot", "vP1", "vP2", "vP3", "iP1", "iP2", and "iP3"
            for (const oldRoleName in roleIds) {
                const oldRoleId = roleIds[oldRoleName];
                if (member.roles.cache.has(oldRoleId) && oldRoleId !== newRoleId) {
                    await member.roles.remove(oldRoleId);
                }
            }

            // Add the new role to the user
            await member.roles.add(newRoleId);

            // Check and update the nickname
            let newNickname = member.nickname || member.user.username;

            // Use regex to replace any current role suffix or add the new one
            newNickname = newNickname.replace(/\| (vSP|vP1|vP2|vP3|iP1|iP2|iP3)/, `| ${role}`);
            if (!newNickname.includes(`| ${role}`)) {
                newNickname = `${newNickname} | ${role}`;
            }

            await member.setNickname(newNickname);

            // Send the congratulatory message
            const channel = await interaction.guild.channels.fetch(promotionsChannelId);
            const message = await channel.send(`Let's congratulate ${user} with their recent promotion to ${role} 🎉`);

            // React to the message
            await message.react('🎉');

            // Acknowledge the interaction
            await interaction.reply({ content: `You have successfully promoted ${user} to ${role} and they have been promoted in <#${promotionsChannelId}>!`, ephemeral: true });

            console.log(`User ${user.tag} promoted to ${role} and their nickname has been updated to ${newNickname}`);
        } catch (error) {
            console.error('Error promoting user:', error);
            await interaction.reply({ content: 'There was an error promoting the user. Please contact Daniel Faria for more info.', ephemeral: true });
        }
    }
};