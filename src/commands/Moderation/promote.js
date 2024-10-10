const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('promote')
        .setDescription('Promote a user to vPPL or vIR role.')
        .addUserOption(option => 
            option.setName('user')
                .setDescription('The user to promote')
                .setRequired(true))
        .addStringOption(option => 
            option.setName('role')
                .setDescription('The role to assign (vPPL or vIR)')
                .setRequired(true)
                .addChoices(
                    { name: 'vPPL', value: 'vPPL' },
                    { name: 'vIR', value: 'vIR' }
                )),

    async execute(interaction) {
        const user = interaction.options.getUser('user');
        const role = interaction.options.getString('role');
        const member = await interaction.guild.members.fetch(user.id);

        // Define role IDs and channel ID
        const roleId = role === 'vPPL' ? '1260981793180614746' : '1260981984151207947';
        const promotionsChannelId = '1264403466457972839';

        try {
            // Add the role to the user
            await member.roles.add(roleId);

            // Check and update the nickname
            let newNickname = member.nickname || member.user.username;

            if (newNickname.includes('| vPPL') || newNickname.includes('| vIR')) {
                newNickname = newNickname.replace(/\| vPPL|\| vIR/, `| ${role}`);
            } else {
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