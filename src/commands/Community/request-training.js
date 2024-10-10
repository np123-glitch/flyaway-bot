const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder } = require('@discordjs/builders');
const { ButtonStyle } = require('discord.js')
const { EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName ('request-training')
    .setDescription('this is the command to request training.')
    // Required options first
    .addStringOption(option =>
        option.setName('vatsimexperience')
            .setDescription('How much VATSIM experience do you have?')
            .setRequired(true)
            .addChoices(
                { name: 'I am new to VATSIM', value: 'I am new to VATSIM' },
                { name: 'I have a small amount of experience on VATSIM', value: 'I have a small amount of experience on VATSIM' },
                { name: 'I am explerienced on VATSIM', value: 'I am explerienced on VATSIM' },
            ))
    .addStringOption(option =>
        option.setName('vfrorifr')
        .setDescription('What type of flight are you looking to perfom?')
        .setRequired(true)
        .addChoices(
            { name: 'vP1', value: 'vP1' },
            { name: 'vP2', value: 'vP2' },
            { name: 'vP3', value: 'vP3' },
            { name: 'iP1', value: 'iP1' },
            { name: 'iP2', value: 'iP2' },
            { name: 'iP3', value: 'iP3' },
            { name: 'Targeted Training', value: 'Targeted Training' } // Add this choice
        ))
    .addStringOption(options => options.setName('desiredaircraft').setDescription('What would be your desired aircraft on this flight?').setRequired(true))
    .addStringOption(option =>
        option.setName('location')
            .setDescription('In which continent are you looking to fly in?')
            .setRequired(true)
            .addChoices(
                { name: 'United States', value: 'United States VATUSA Division' },
                { name: 'North America', value: 'North America' },
                { name: 'South America', value: 'South America' },
                { name: 'Europe', value: 'Europe' },
                { name: 'Africa', value: 'Africa' },
                { name: 'Asia', value: 'Asia' },
                { name: 'Australia', value: 'Australia' },
                { name: 'Antarctica', value: 'Antarctica' }
            ))
    // Optional option after required options
    .addStringOption(options => options.setName('comments').setDescription('Any extra comments?').setRequired(false)) // Make this optional

   , async execute(interaction, client) { 
        const student = (`${interaction.user.id}`);
        const vatsimexperience = interaction.options.getString('vatsimexperience');
        const vfrorifr = interaction.options.getString('vfrorifr');
        const desiredaircraft = interaction.options.getString('desiredaircraft');
        const location = interaction.options.getString('location');
        const comments = interaction.options.getString('comments'); // Get the targeted training description

        const exampleEmbed = new EmbedBuilder()
            .setColor(0xFFFFFF)
            .setTitle('Training Request Submitted')
            .setAuthor({ name: 'FlyAway Bot', iconURL: 'https://media.discordapp.net/attachments/1261077608817234010/1261689389667582045/FLIGH_AWAY.png?ex=669530cf&is=6693df4f&hm=d23cfa54fd248a3e1a23f5a1f319c134a3efbfe1d3ed5344b93362c715fd27f5&=&format=webp&quality=lossless' })
            .setDescription('Your training request was subbmitted. A member of the Training Team will pick it up if they would like. Your session is not **required** to be accepted. You may request more sessions whenever you would like.')
            .addFields(
                { name: 'Student', value: `${interaction.user}` },
                { name: 'VATSIM Experience', value: `${vatsimexperience}` },
                { name: 'Desired Flight Type', value: `${vfrorifr}` },
                { name: 'Desired Aircraft', value: `${desiredaircraft}` },
                { name: 'Location', value: `${location}` },
            )
            .setFooter({ text: `Maintained by the Fly Away's Administrative Department`, iconURL: 'https://media.discordapp.net/attachments/1261077608817234010/1261689389667582045/FLIGH_AWAY.png?ex=669530cf&is=6693df4f&hm=d23cfa54fd248a3e1a23f5a1f319c134a3efbfe1d3ed5344b93362c715fd27f5&=&format=webp&quality=lossless' });

        if (comments) {
            exampleEmbed.addFields({ name: 'Extra Comments', value: `${comments}` }); // Add the description if targeted training is selected
        }

        const accept = new ButtonBuilder()
            .setCustomId(`acceptTraining_${interaction.user.id}`)
            .setLabel('Accept Training Request (vCFIs ONLY)')
            .setStyle(ButtonStyle.Primary);

        const row = new ActionRowBuilder()
            .addComponents(accept);

        if (interaction.channel.id !== '1262159111680950313') {
            interaction.reply({ content: 'You can not request training here, please use <#1262159111680950313>.', ephemeral: true })
            return;
        }
        interaction.reply({ content: '<@&1260981475369554004>', embeds: [exampleEmbed], components: [row] });

        console.log(`${interaction.user} has used the /request-training command. Waiting for a vCFI to accept the training request.`)
    }
};

