const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
    .setName ('test')
    .setDescription('this is the test command'),
    async execute(interaction, client) {
        await interaction.reply ({content: ` Hey ${interaction.user}!! the bot is working!`, ephemeral: true});
    }
}