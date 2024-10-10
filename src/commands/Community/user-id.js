const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
    .setName ('user-id')
    .setDescription('what is my user id'),
    async execute(interaction, client) {
        await interaction.reply ({content: ` USER ID: ${interaction.user.id}`, ephemeral: true});
    }
}