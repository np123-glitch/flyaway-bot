const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder } = require('@discordjs/builders');
const { ButtonStyle } = require('discord.js')
const { EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('show-training')
    .setDescription('This is the command for vCFIs to show impromptu training availability.')
    .addStringOption(option =>
      option.setName('can-teach')
        .setDescription('The training type')
        .setRequired(true)
        .addChoices(
          { name: 'VATSIM PPL Training', value: 'VATSIM PPL Training Only' },
          { name: 'VATSIM IR Training', value: 'VATSIM IR Training Only' },
          { name: 'VATSIM PPL or IR Training', value: 'VATSIM PPL or IR Training' },
        )
    )
    .addStringOption(option =>
      option.setName('preferred-sim')
        .setDescription('In which continent are you comfortable teaching in?')
        .setRequired(true)
        .addChoices(
          { name: 'MSFS2024', value: 'MSFS2024' },
          { name: 'MSFS2020', value: 'MSFS2020' },
          { name: 'MSFS2020 or MSFS2024', value: 'MSFS2020 or MSFS2024' },
          { name: 'X-Plane 12', value: 'X-Plane 12' },
          { name: 'X-Plane 11', value: 'X-Plane 11' },
          { name: 'P3D', value: 'P3D' },
          { name: 'Any Flight Sim', value: 'No Preference' },
        )
    )
    .addStringOption(options => options.setName('aircraft').setDescription('What aircraft are you comfortable teaching in?').setRequired(true))
    .addStringOption(option =>
      option.setName('location')
        .setDescription('In which continent are you comfortable teaching in?')
        .setRequired(true)
        .addChoices(
          { name: 'United States', value: 'United States VATUSA Division' }

        )
    )
    .addStringOption(options => options.setName('comments').setDescription('Any extra comments?').setRequired(false)),

  async execute(interaction, client) {
    const student = interaction.user.id;
    const session = interaction.options.getString('can-teach');
    const preferredSim = interaction.options.getString('preferred-sim');
    const aircraft = interaction.options.getString('aircraft');
    const location = interaction.options.getString('location');
    const comments = interaction.options.getString('comments');

    const exampleEmbed = new EmbedBuilder()
      .setColor(0xFFFFFF)
      .setTitle('Impromptu Training Availability Posted')
      .setAuthor({ name: 'FlyAway Bot', iconURL: 'https://cdn.discordapp.com/attachments/1261077608817234010/1261689389667582045/FLIGH_AWAY.png?ex=6695d98f&is=6694880f&hm=196e3e7800f06e6965b8e0380e7638d9d29b07253b8ecc9df13e128e71faf325&' })
      .setDescription('A member of the staff has posted availability to train!! Click the button below to begin.')
      .addFields(
        { name: 'Flight Instructor', value: interaction.user.toString() },
        { name: 'Type Of Session Available To Teach', value: session },
        { name: 'Preferred Flight Simulator', value: preferredSim },
        { name: 'Aircraft Available To Teach', value: aircraft },
        { name: 'Flight Location', value: location },
      )
      .setFooter({ text: 'Maintained by the FlyAway Virtual Flight School Training Department', iconURL: 'https://cdn.discordapp.com/attachments/1261077608817234010/1261689389667582045/FLIGH_AWAY.png?ex=6695d98f&is=6694880f&hm=196e3e7800f06e6965b8e0380e7638d9d29b07253b8ecc9df13e128e71faf325&' });

    if (comments) {
      exampleEmbed.addFields({ name: 'Extra Comments', value: comments });
    }

    const accept = new ButtonBuilder()
      .setCustomId(`acceptAvailablility_${interaction.user.id}`)
      .setLabel('Accept Availability')
      .setStyle(ButtonStyle.Primary);

    const row = new ActionRowBuilder()
      .addComponents(accept);

    if (interaction.channel.id !== '1262159111680950313') {
      interaction.reply({ content: 'You can not **Show Training** here. Please use <#1262159111680950313>.', ephemeral: true });
      return;
    }

    await interaction.reply({ content: `<@&1262252948415582318>`, embeds: [exampleEmbed], components: [row] });

    console.log(`${interaction.user} has used the /show-training command. Waiting for a student to accept the availability.`);
  },
};