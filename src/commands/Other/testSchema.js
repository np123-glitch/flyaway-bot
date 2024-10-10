const { SlashCommandBuilder } = require('discord.js');
const testSchema = require('../../Schemas/test');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('test-schema')
    .setDescription('Testing a Schema')
    .addStringOption(option => option.setName('schema-input').setDescription('text to save').setRequired(true)),
    async execute(interaction) {

        
        const { options } = interaction;
        const string = options.getString('schema-input');

        await testSchema.create({
            name: string
        });

        await interaction.reply(`I saved the data!`)

    }
}