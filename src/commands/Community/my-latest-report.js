const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('my-latest-report')
        .setDescription('View your latest training report'),

    async execute(interaction) {
        const student = interaction.user;
        
        try {
            const response = await fetch(`https://flyawayvirtual.com/api/student-reports?studentId=${student.id}`);
            const reports = await response.json();

            if (reports.length === 0) {
                return interaction.reply({ content: 'You have no training reports yet', ephemeral: true });
            }

            // Get the most recent report
            const latestReport = reports[reports.length - 1];

            const embed = new EmbedBuilder()
                .setTitle(`Your Latest Training Report`)
                .setColor('Blue')
                .setDescription(`
                **Session Type:** ${latestReport.sessionType}
                **Instructor:** ${latestReport.instructorNickname}
                **Date:** ${new Date(latestReport.date).toLocaleDateString()}
                
                **Flight Details**
                Callsign: ${latestReport.callsign}
                Departure: ${latestReport.departureAirport}
                Arrival: ${latestReport.arrivalAirport}
                
                **Scores**
                Radio Communication: ${latestReport.radioCommunication}/10
                Preflight Planning: ${latestReport.preflightPlanning}/10
                Departure Score: ${latestReport.departureScore}/10
                Approach and Landing: ${latestReport.approachLanding}/10
                
                **Final Notes:** ${latestReport.finalNotes}
                ${latestReport.nextRating ? `\n**Next Session:** ${latestReport.nextRating}` : ''}
                `)
                .setTimestamp();

            await interaction.reply({ embeds: [embed], ephemeral: true });

        } catch (error) {
            console.error('Error fetching student report:', error);
            await interaction.reply({ 
                content: 'There was an error fetching your training report', 
                ephemeral: true 
            });
        }
    }
};
