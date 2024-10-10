const { SlashCommandBuilder } = require('discord.js');
const testSchema = require('../../Schemas/test');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('read-schema')
    .setDescription('Testing a schema'),
    async execute (interaction) {

        const data = await testSchema.find();

        var values = [];
        await data.forEach(async d => {
            values.push(d.name);
        });

        await interaction.reply({ content: `${values.join('\n')}`});

    }
}