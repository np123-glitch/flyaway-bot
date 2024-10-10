const { SlashCommandBuilder } = require('discord.js')

module.exports = {
  data: new SlashCommandBuilder()
.setName('set-nickname-to-irl')
.setDescription('Dm a user to set nickname to IRL name')
.addUserOption(options => options.setName('user').setDescription('The user to dm').setRequired(true)),

async execute(interaction) {
  const target = await interaction.options.getUser('user')
  

  await interaction.reply ({content: 'Message has been sent!' , ephemeral: true })
  

  await target.send (`The following message was sent by **FlyAway Virtual Flight School's** Administration Department ------ Hello ${target}!! Please set your **SERVER NICKNAME** to your **IRL first name and last name** by using the /setup-nickname command in any channel. This is **REQUIRED** and ignoring this may cause in a kick or ban. If you would like an exception, Please contact on of the **admins** at **Fly Away**. Have a good rest of your day!!`)}
 
}