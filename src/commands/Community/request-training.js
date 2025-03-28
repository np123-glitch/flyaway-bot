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
                { name: 'I am experienced on VATSIM', value: 'I am experienced on VATSIM' },
            ))
    .addStringOption(option =>
        option.setName('vfrorifr')
        .setDescription('What type of flight are you looking to perfom?')
        .setRequired(true)
        .addChoices(
            { name: 'VATSIM PPL', value: 'VATSIM PPL' },
            { name: 'VATSIM IR', value: 'VATSIM IR' },
            { name: 'Targeted Training', value: 'Targeted Training' } // Add this choice
        ))
        
			.addStringOption(option =>
				option.setName('preferred-sim')
					.setDescription('In which continent are you comfortable teaching in?')
					.setRequired(true)
					.addChoices(
						{ name: 'MSFS2024', value: 'MSFS2024' },
                        { name: 'MSFS2020', value: 'MSFS2020' },
						{ name: 'X-Plane 12', value: 'X-Plane 12' },
						{ name: 'X-Plane 11', value: 'X-Plane 11' },
						{ name: 'P3D', value: 'P3D' },
						{ name: 'Any Flight Sim', value: 'No Preference' }

					))

    .addStringOption(options => options.setName('desiredaircraft').setDescription('What would be your desired aircraft on this flight?').setRequired(true))

    .addStringOption(option =>
        option.setName('location')
            .setDescription('In which continent are you looking to fly in?')
            .setRequired(true)
            .addChoices(
                { name: 'United States (Only Current Option)', value: 'United States VATUSA Division' }


            ))
    // Optional option after required options
    .addStringOption(options => options.setName('comments').setDescription('Any extra comments?').setRequired(false)) // Make this optional

   , async execute(interaction, client) { 
        const student = (`${interaction.user.id}`);
        const vatsimexperience = interaction.options.getString('vatsimexperience');
        const vfrorifr = interaction.options.getString('vfrorifr');
        const preferredsim = interaction.options.getString('preferred-sim');
        const desiredaircraft = interaction.options.getString('desiredaircraft');
        const location = interaction.options.getString('location');
        const comments = interaction.options.getString('comments'); // Get the targeted training description

        const exampleEmbed = new EmbedBuilder()
            .setColor(0xFFFFFF)
            .setTitle('Training Request Submitted')
            .setAuthor({ name: 'FlyAway Bot', iconURL: 'https://media.discordapp.net/attachments/1261077608817234010/1261689389667582045/FLIGH_AWAY.png?ex=669530cf&is=6693df4f&hm=d23cfa54fd248a3e1a23f5a1f319c134a3efbfe1d3ed5344b93362c715fd27f5&=&format=webp&quality=lossless' })
            .setDescription('Your training request was submitted. A member of the Training Team will pick it up if they would like. Your session is not **required** to be accepted. You may request more sessions whenever you would like.')
            .addFields(
                { name: 'Student', value: `${interaction.user}` },
                { name: 'VATSIM Experience', value: `${vatsimexperience}` },
                { name: 'Desired Flight Type', value: `${vfrorifr}` },
                { name: 'Preferred Sim', value: `${preferredsim}` },
                { name: 'Desired Aircraft', value: `${desiredaircraft}` },
                { name: 'Location', value: `${location}` },
            )
            .setFooter({ text: `Maintained by the FlyAway's Administrative Department`, iconURL: 'https://media.discordapp.net/attachments/1261077608817234010/1261689389667582045/FLIGH_AWAY.png?ex=669530cf&is=6693df4f&hm=d23cfa54fd248a3e1a23f5a1f319c134a3efbfe1d3ed5344b93362c715fd27f5&=&format=webp&quality=lossless' });

        if (comments) {
            exampleEmbed.addFields({ name: 'Extra Comments', value: `${comments}` }); // Add the description if comments is selected
        }

        const accept = new ButtonBuilder()
            .setCustomId(`acceptTraining_${interaction.user.id}`)
            .setLabel('Accept Training Request (Training Staff ONLY)')
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

