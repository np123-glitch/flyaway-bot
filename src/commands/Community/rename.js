const { SlashCommandBuilder } = require('discord.js');
const getUserModel = require('../../Schemas/User'); // Import the User model

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rename')
        .setDescription('Rename your nickname.')
        .addStringOption(option =>
            option.setName('name_format')
                .setDescription('Select your desired name format.')
                .setRequired(true)
                .addChoices(
                    { name: 'Full Name', value: 'fullName' },
                    { name: 'First Name and CID', value: 'firstInitialLastName' },
                    { name: 'First Name and Last Initial', value: 'firstNameLastInitial' },
                )),
    async execute(interaction) {
        const chosenFormat = interaction.options.getString('name_format');
        const discordId = interaction.user.id;

        try {
            const User = getUserModel();
            const user = await User.findOne({ discordId });

            if (!user) {
                return await interaction.reply({ content: 'Your Discord ID is not linked to a FlyAway account. Please contact staff.', ephemeral: true });
            }

            let newName;

            switch (chosenFormat) {
                case 'fullName':
                    newName = user.fullName;
                    break;
                case 'firstInitialLastName':
                    newName = `${user.firstName} - ${user.vatsimId}`;
                    break;
                case 'firstNameLastInitial':
                    newName = `${user.firstName} ${user.lastName.charAt(0)}.`;
                    break;
                default:
                    return await interaction.reply({ content: 'Invalid name format selected.', ephemeral: true });
            }


            await interaction.member.setNickname(newName);
            await interaction.reply({ content: `Your nickname has been updated to: **${newName}**`, ephemeral: true });


        } catch (error) {
            console.error('Error renaming user:', error);
            await interaction.reply({ content: 'An error occurred while updating your nickname. Please contact staff.', ephemeral: true });
        }
    },
};
