const { SlashCommandBuilder,ActionRowBuilder, ButtonBuilder } = require('@discordjs/builders');
const { ButtonStyle } = require('discord.js')
const { EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName ('show-training')
    .setDescription('This is the command for vCFIs to show impromtpu training availablility.')
    .addStringOption(option =>
		option.setName('can-teach')
			.setDescription('The training type')
			.setRequired(true)
			.addChoices(

				{ name: 'vP3, vP2, or vP1', value: 'vP3, vP2, or vP1' },
				{ name: 'iP3, iP2, or iP1', value: 'iP3, iP2, or iP1' },
				{ name: 'ANY ACADEMY SESSION', value: 'Any Academy Session' },

                
			))
		.addStringOption(options => options.setName('aircraft').setDescription('What aircarfts are you comfortable teaching in?').setRequired(true))
			.addStringOption(option =>
				option.setName('location')
					.setDescription('In which continent are you comfortable teaching in?')
					.setRequired(true)
					.addChoices(
						{ name: 'United States', value: 'United States VATUSA Division' },
						{ name: 'North America', value: 'North America' },
						{ name: 'South America', value: 'South America' },
						{ name: 'Europe', value: 'Europe' },
						{ name: 'Africa', value: 'Africa' },
						{ name: 'Asia', value: 'Asia' },
						{ name: 'Australia', value: 'Australia' }

					)),	
    
			
			
			async execute(interaction, client) {

				const student = (`${interaction.user.id}`);
				const session = interaction.options.getString('can-teach');
				const aircraft = interaction.options.getString('aircraft');
				const location = interaction.options.getString('location');
				const exampleEmbed = new EmbedBuilder()
		
	
	
    .setColor(0xFFFFFF)
	.setTitle('Impromptu Training Availablility Posted')
	.setAuthor({ name: 'FlyAway Bot', iconURL: 'https://cdn.discordapp.com/attachments/1261077608817234010/1261689389667582045/FLIGH_AWAY.png?ex=6695d98f&is=6694880f&hm=196e3e7800f06e6965b8e0380e7638d9d29b07253b8ecc9df13e128e71faf325&' })
	.setDescription('A member of the staff has posted availablility to train!! Click the button below to begin.')
	.addFields(
		{ name: 'Flight Instructor', value: `${interaction.user}` },
		{ name: 'Type Of Session Available To Teach', value: `${session}` },
		{ name: 'Aircrafts Available To Teach', value: `${aircraft}` },
		{ name: 'Flight Location', value: `${location}` }
	)
	.setFooter({ text: 'Maintained by the Fly Away Virtual Flight School Administration Department', iconURL: 'https://cdn.discordapp.com/attachments/1261077608817234010/1261689389667582045/FLIGH_AWAY.png?ex=6695d98f&is=6694880f&hm=196e3e7800f06e6965b8e0380e7638d9d29b07253b8ecc9df13e128e71faf325&' });

    const accept = new ButtonBuilder()
			.setCustomId(`acceptAvailablility_${interaction.user.id}`)
			.setLabel('Accept Availability')
			.setStyle(ButtonStyle.Primary);

		const row = new ActionRowBuilder()
			.addComponents(accept);
			
			if (interaction.channel.id !== '1262159111680950313'){
				// bad >:(
					interaction.reply({content: 'You can not **Show Training** here. Please use <#1262159111680950313>.', ephemeral: true })
				return; 
			}
			await interaction.reply ({content: `<@&1262252948415582318>`, embeds: [exampleEmbed], components: [row] });
			

	console.log(`${interaction.user} has used the /show-training command. Waiting for a student to accept the availablity.`)					
			


	}
	

}