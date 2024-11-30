const { SlashCommandBuilder } = require('discord.js');
const getUserModel = require('../../Schemas/User'); // Adjust path as needed

module.exports = {
    data: new SlashCommandBuilder()
        .setName('verify')
        .setDescription('Link your Discord account to your VATSIM CID')
        .addStringOption(option =>
            option.setName('cid')
            .setDescription('Your VATSIM CID')
            .setRequired(true)
        ),
    async execute(interaction) {
        const User = getUserModel();
        const cid = interaction.options.getString('cid').trim();
        const discordId = interaction.user.id;
        const guild = interaction.guild;
        const member = interaction.member; // Get the member object

        try {
            console.log(`Searching for user with CID: ${cid}`);

            const user = await User.findOne({ vatsimId: cid });

            if (!user) {
                return interaction.reply({ content: `No VATSIM profile found with that CID (${cid}). Make sure you logged in with VATSIM on the website.`, ephemeral: true });
            }

            // Update user data in the database
            await User.updateOne({ vatsimId: cid }, {
                discordId: discordId,
                discordUsername: interaction.user.username,
                roles: member.roles.cache.map(role => role.id), // Store existing roles
                discordLinked: true
            });


            // Role assignments (Pilot and ATC)
            const pilotRating = user.pilotRating;
            const atcRating = user.ratingShort;

            const pilotRole = guild.roles.cache.find(role => role.name === `VATSIM ${pilotRating}`);
            const atcRole = guild.roles.cache.find(role => role.name === `ATC RATING: ${atcRating}`);

            if (pilotRole) {
                await member.roles.add(pilotRole);
            }
            if (atcRole) {
                await member.roles.add(atcRole);
            }

            const verifiedRole = guild.roles.cache.get('1260981907227807754');
            if (verifiedRole) {
                await member.roles.add(verifiedRole);
            } else {
                console.error('Verified role not found in the guild.');
            }


            // Nickname setting (excluding specific roles)
            const excludedRoles = ["Admin", "VCFI", "WebTeam"]; // Replace with your actual role names
            if (!member.roles.cache.some(role => excludedRoles.includes(role.name))) {
                const nickname = pilotRating === "NEW" ? `${user.firstName} ${user.lastName}` : `${user.firstName} ${user.lastName} | ${pilotRating}`;
                await member.setNickname(nickname);
            }



            interaction.reply({ content: `Hey ${user.firstName}, your Discord account has been successfully linked to VATSIM CID ${cid}. You have been given the Verified role and appropriate pilot/ATC roles.`, ephemeral: true });

        } catch (error) {
            console.error('Error during /verify command:', error);
            interaction.reply({ content: 'An error occurred during verification. Please try again later.', ephemeral: true });
        }
    },
};
