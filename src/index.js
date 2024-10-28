const { createTranscript } = require('discord-html-transcripts');
require ("dotenv").config ({debug:true});
const { Client, GatewayIntentBits, PermissionsBitField, Permissions, Partials, MessageManager, Embed, Collection, ActivityType, EmbedBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, Events, ChannelType, ButtonBuilder, ActionRowBuilder, ButtonStyle, DefaultDeviceProperty } = require('discord.js');
const fs = require('fs');
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const createReportModel = require('./Schemas/reportSchema');
const FAQ = require('./Schemas/FAQ');
const getFAQModel = require('./Schemas/FAQ');





const client = new Client({
    intents: [
GatewayIntentBits.Guilds,
GatewayIntentBits.GuildMessages,
GatewayIntentBits.MessageContent,
GatewayIntentBits.GuildMembers,
GatewayIntentBits.GuildPresences,
GatewayIntentBits.DirectMessages,
GatewayIntentBits.DirectMessageTyping,
GatewayIntentBits.DirectMessageReactions,
    ], partials: [Partials.Message, Partials.Channel, Partials.Reaction] });

client.commands = new Collection();


const functions = fs.readdirSync("./src/functions").filter(file => file.endsWith(".js"));
const eventFiles = fs.readdirSync("./src/events").filter(file => file.endsWith(".js"));
const commandFolders = fs.readdirSync("./src/commands");

//MODMAIL VARIABLES:
let guildId = process.env.guildId;
let categoryId = process.env.categoryId;
let transcriptChannelId = process.env.transcriptChannelId;

//COMMAND VARIABLES:
(async () => {
    for (file of functions) {
        require(`./functions/${file}`)(client);
    }
    client.handleEvents(eventFiles, "./src/events");
    client.handleCommands(commandFolders, "./src/commands");
    client.login(process.env.CLIENT_TOKEN)
})();



client.on('interactionCreate', async (interaction) => {
    if (!interaction.isButton()) return;

    const args = interaction.customId.split('_');
    const command = args.shift();

    if (command === 'acceptTraining') {
        if (!interaction.member._roles.includes('1260981475369554004') ){
            interaction.reply({content: 'This command is for staff only!!', ephemeral: true })
            return;
       
        }
        
        
        const user = await client.users.fetch(args[0]);

        
        try {
        
            await user.send(`Hello!! I am FlyAway Bot from Fly Away Virtual Flight School! A member of the Training Staff has accepted your training session and is ready to go when you are. Join https://discord.com/channels/1119458052886769679/1119458646842163281 when you are ready to start your session.`);
            interaction.reply({content: `Hello ${interaction.user} the Training Session has been accepted successfully! ${user} has been notified via a Direct Message and should join the Training Waiting Room soon. If he does not join after a little bit, Please DM him and ask if there was a mistake.  `, ephemeral: true })
        interaction.message.delete ()
        } catch (error) {
        
            // DMs are closed :(
        }
    }
});

// Command For Show Training

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isButton()) return;

    const args = interaction.customId.split('_');
    const command = args.shift();

    if (command === 'acceptAvailablility') {
        if (interaction.member._roles.includes('1260981475369554004') ){
            interaction.reply({content: 'Training staff can not accept training session availablity from other staff!!', ephemeral: true })
            return;
       
        }
        
        
        const user = await client.users.fetch(args[0]);

        
        try {
        
            await user.send(`Hello!! I am FlyAway Bot from Fly Away Virtual Flight School! **${interaction.user.tag}** has accepted your Training Session Availablility and is ready to go when you are. Join a **Training Room** drag the student in when you are ready to start. **Remember to see if the student has any past student reports. Good luck**!!`);
            interaction.reply({content: `Hello ${interaction.user} the Training Session has been accepted successfully! ${user} has been notified via a Direct Message and should drag you in soon when ready to start. If the your vCFI does not join after a little bit, Please DM him and ask if there was a mistake.  `, ephemeral: true })
        interaction.message.delete ()
        } catch (error) {
        
            // DMs are closed :(
        }
    }
});


//Button For Verify Hours

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isButton()) return;

    const args = interaction.customId.split('_');
    const command = args.shift();

    if (command === 'hours') {      
    }
});

// Forum channel IDs
const forumChannels = ['1289283910240309321', '1296599166906138654'];

client.on('threadCreate', async (thread) => {
    // Check if the new thread is created in one of the forum channels
    if (forumChannels.includes(thread.parentId)) {
        // Add a 10-second delay before replying
        setTimeout(async () => {
            try {
                // Reply to the user who created the thread (starterMessage.author)
                const starterMessage = await thread.fetchStarterMessage(); // Fetch the original post
                if (starterMessage) {
                    await starterMessage.reply("Thanks for your request, we will accommodate as soon as possible.");
                }
            } catch (error) {
                console.error('Error replying to the thread:', error);
            }
        }, 10000); // 10-second delay (10000 milliseconds)
    }
});

// New Member Welcome Message

// Array of welcome messages
const welcomeMessages = [
    `Welcome aboard, <@{userId}>! You've just taken off as our {membercount}th member at FlyAway Virtual Flight School! 🎉 We hope you have a smooth journey with us.`,
    `Hello <@{userId}>! You've just touched down at FlyAway Virtual Flight School as our {membercount}th member! 🎉 Buckle up and enjoy the flight.`,
    `Greetings <@{userId}>! You've joined FlyAway Virtual Flight School as our {membercount}th member! 🎉 Ready for takeoff? We're thrilled to have you with us.`,
    `Welcome <@{userId}>! As our {membercount}th member, you're cleared for takeoff at FlyAway Virtual Flight School! 🎉 We can't wait to see you soar.`,
    `Hi <@{userId}>! You've just joined the FlyAway Virtual Flight School as our {membercount}th member! 🎉 Prepare for an exciting journey ahead.`,
    `Salutations, <@{userId}>! You've officially joined our squadron as the {membercount}th member. 🎉 Let’s take to the skies!`,
    `Welcome to the runway, <@{userId}>! You’re our {membercount}th member to join FlyAway Virtual Flight School. 🎉 Get ready for a fantastic flight experience!`,
    `Hey <@{userId}>, you're our {membercount}th member! 🎉 Welcome to FlyAway Virtual Flight School. Buckle up, it's going to be an exhilarating ride!`,
    `Glad to have you, <@{userId}>! As our {membercount}th member, you're now part of our aviation crew! 🎉 Get ready for some high-flying fun.`,
    `Welcome, <@{userId}>! You’re the {membercount}th person to join our flight school! 🎉 We hope your time here is as smooth as a jet stream.`,
    `Ahoy, <@{userId}>! You've just become our {membercount}th member. 🎉 Fasten your seatbelt and enjoy your time at FlyAway Virtual Flight School.`,
    `Welcome <@{userId}>! You’re officially the {membercount}th member at FlyAway Virtual Flight School. 🎉 Fasten your seatbelt and enjoy the journey.`,
    `Hello <@{userId}>! You've just joined our flight crew as the {membercount}th member! 🎉 Here’s to smooth skies and exciting adventures!`,
    `Welcome to our aviation family, <@{userId}>! You’re the {membercount}th member at FlyAway Virtual Flight School. 🎉 Let’s soar to new heights together.`,
    `Hi <@{userId}>! You’ve just taken your first step with us as our {membercount}th member! 🎉 Get ready for an exciting journey at FlyAway Virtual Flight School.`,
    `Welcome, <@{userId}>! As our {membercount}th member, you’re cleared for takeoff! 🎉 We can’t wait to have you explore the skies with us.`,
    `Greetings, <@{userId}>! You’ve just joined our virtual flight school as the {membercount}th member. 🎉 Buckle up for a fantastic flight experience!`,
    `Welcome aboard, <@{userId}>! You’re now our {membercount}th member. 🎉 Get ready to experience the thrill of flying with us at FlyAway Virtual Flight School.`,
    `Hello <@{userId}>! You’ve just become our {membercount}th member! 🎉 Get ready for a fantastic flight experience at FlyAway Virtual Flight School.`,
    `Greetings <@{userId}>! You’re now part of our virtual aviation community as the {membercount}th member. 🎉 Let’s take to the skies and have some fun!`,
    `Welcome aboard, <@{userId}>! You’re the {membercount}th member to join FlyAway Virtual Flight School. 🎉 We hope you enjoy your time with us.`,
    `Hi <@{userId}>! You've just become our {membercount}th member. 🎉 Welcome to FlyAway Virtual Flight School, where every day is a new adventure.`,
    `Welcome <@{userId}>! You’re officially the {membercount}th member at FlyAway Virtual Flight School. 🎉 Fasten your seatbelt and enjoy the journey.`,
    `Hello <@{userId}>! You’ve just joined as our {membercount}th member! 🎉 Get ready for a fantastic flight experience at FlyAway Virtual Flight School.`
];

client.on('guildMemberAdd', async member => {
  const LeaveChannel = member.guild.channels.cache.get('1260987656813285579');
  const membercount = member.guild.memberCount;

  // Select a random welcome message
  const randomMessage = welcomeMessages[Math.floor(Math.random() * welcomeMessages.length)];
  const personalizedMessage = randomMessage.replace(/{userId}/g, member.id).replace(/{membercount}/g, membercount);

  const LeaveEmbed = new EmbedBuilder()
      .setColor("Green")
      .setAuthor({ name: `${member.user.username}`, iconURL: member.displayAvatarURL({ dynamic: true }) })
      .setTitle('A New Member Joined FlyAway Virtual Flight School!')
      .setDescription(personalizedMessage)
      .addFields(
          { name: 'Member Count', value: `${membercount}`, inline: true },
          { name: 'Account Created', value: `${member.user.createdAt.toDateString()}`, inline: true }
      )
      .setTimestamp()
      .setFooter({ text: `ID: ${member.id}` });

  try {
      // Send the embed message with the personalized welcome content
      const sentMessage = await LeaveChannel.send({ embeds: [LeaveEmbed] });
      await sentMessage.react('🎉');

      // Add vStudent Pilot role to the member
      member.roles.add(member.guild.roles.cache.find(role => role.name === "vStudent Pilot"));

      // Change the member's nickname to include "| vSP"
      await member.setNickname(`${member.user.username} | vSP`);

      // Send a direct message to the new member
      await member.send(`Welcome to the FlyAway Virtual Flight School! You are our ${membercount}th member to join us 🎉

To better understand our community and how it works, please check out our SOPs and Policies at https://flyawayvirtual.com/documents/. You have automatically been awarded our **vStudent Pilot** role as part of our system when you joined. If you are already proficient on the network and just want to chill with us, we recommend you take a couple checkouts and follow the process outlined in the Training SOP to quickly earn your iP3 rating. 

From all of us at **FlyAway**, welcome and enjoy your time with us.`);

      console.log(`${member.user.username} has joined FlyAway. Their nickname has been set and they have been successfully DMed.`);
      
  } catch (error) {
      console.error('Error sending welcome message, reacting, or setting nickname:', error);
  }
});



// vCFI promotion

const vCFI_ROLE_ID = '1260981475369554004'; // ID of the vCFI role
const promotionsChannelId = '1264403466457972839'; // ID of the promotions channel

client.on(Events.GuildMemberUpdate, async (oldMember, newMember) => {
    // Check if the vCFI role was removed
    if (oldMember.roles.cache.has(vCFI_ROLE_ID) && !newMember.roles.cache.has(vCFI_ROLE_ID)) {
        // The vCFI role was removed
        const user = newMember.user;

        try {
            // Check and update the nickname
            let newNickname = newMember.nickname || newMember.user.username;

            if (newNickname.includes('| vCFI')) {
                // Replace "| vCFI" with "| viP3"
                newNickname = newNickname.replace('| vCFI', '| iP3');
            }

            await newMember.setNickname(newNickname);

            // Log the change
            console.log(`User ${user.tag} had their vCFI role removed. The new nickname has been set to ${newNickname}.`);
        
        } catch (error) {
            console.error('Error updating nickname after vCFI role removal:', error);
        }
    }

    // Check if the vCFI role was added
    if (!oldMember.roles.cache.has(vCFI_ROLE_ID) && newMember.roles.cache.has(vCFI_ROLE_ID)) {
        // The vCFI role was added
        const user = newMember.user;

        try {
            // Check and update the nickname
            let newNickname = newMember.nickname || newMember.user.username;

            // Check for any of the tags and replace or add "| vCFI" as needed
            if (!/\| (vSP|vP1|vP2|vP3|iP1|iP2|iP3)/.test(newNickname)) {
                newNickname = `${newNickname} | vCFI`;
            } else {
                newNickname = newNickname.replace(/\| (vSP|vP1|vP2|vP3|iP1|iP2|iP3)/, '| vCFI');
            }

            await newMember.setNickname(newNickname);

            // Fetch the promotions channel
            const channel = await newMember.guild.channels.fetch(promotionsChannelId);

            // Send the congratulatory message
            await channel.send(`Let's congratulate ${user} with their recent promotion to vCFI 🎉`);

            console.log(`User ${user.tag} has successfully been promoted to vCFI. The new nickname has been set to ${newNickname} and has been announced in the promotion channel.`);
        
        } catch (error) {
            console.error('Error updating nickname or sending promotion announcement:', error);
        }
    }
});

function getPreviousRating(currentRating) {
  const ratingsOrder = ['vStudent Pilot', 'vP1', 'vP2', 'vP3', 'iP1', 'iP2', 'iP3'];
  const currentIndex = ratingsOrder.indexOf(currentRating);

  // Return the previous rating if available, otherwise return null
  return currentIndex > 0 ? ratingsOrder[currentIndex - 1] : null;
}

async function updateDiscordRoles(studentId, newRating, oldRating, promote = true) {
  try {
    const guild = client.guilds.cache.get(guildId);
    const member = await guild.members.fetch(studentId);

    // Find the new role based on the newRating argument
    const newRole = guild.roles.cache.find(role => role.name === newRating);

    if (newRole) {
      const allRatings = ['vStudent Pilot', 'vP1', 'vP2', 'vP3', 'iP1', 'iP2', 'iP3'];
      for (const rating of allRatings) {
        if (rating !== newRating) {
          const oldRole = guild.roles.cache.find(role => role.name === rating);
          if (oldRole && member.roles.cache.has(oldRole.id)) {
            await member.roles.remove(oldRole);  // Remove all other rating roles
          }
        }
      }

      // Add a small delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // Add the new rating role
      await member.roles.add(newRole);
      console.log(`Added role ${newRating} to user ${studentId}`);

      // Update nickname
      let newNickname = member.nickname || member.user.username;
      allRatings.forEach(rating => {
        if (newNickname.includes(`| ${rating}`)) {
          newNickname = newNickname.replace(`| ${rating}`, `| ${newRating}`);
        }
      });

      if (!newNickname.includes(`| ${newRating}`)) {
        newNickname = `${newNickname} | ${newRating}`;
      }
      await member.setNickname(newNickname);

      // Announce the new rating only if promote is true
      if (promote) {
        const announcementChannel = client.channels.cache.get('1264403466457972839');
        if (announcementChannel) {
          const mentionTag = `<@${studentId}>`;
          const message = await announcementChannel.send(`Let's congratulate ${mentionTag} with their recent promotion to ${newRating} 🎉`);
          await message.react('🎉');
        } else {
          console.error(`Channel with ID '1264403466457972839' not found.`);
        }
      }
    } else {
      console.error(`Role ${newRating} not found in guild.`);
    }
  } catch (error) {
    console.error('Error updating Discord roles:', error);
  }
}



const app = express();
app.use(cors());
app.use(express.json());
const InstructorResource = require('./Schemas/InstructorResource'); // Import InstructorResource model
const Exam = require('./Schemas/Exam');
const ExamAttempt = require('./Schemas/ExamAttempt');
const ExamAssignment = require('./Schemas/ExamAssignment');



const PORT = process.env.PORT || 3001;

app.get('/users', async (req, res) => {
    if (!client.isReady()) {
      return res.status(503).json({ error: 'Discord bot is not ready' });
    }
    try {
      const guild = client.guilds.cache.get(guildId);
      if (!guild) {
        return res.status(404).json({ error: 'Guild not found' });
      }
      const members = await guild.members.fetch();
      const users = members.map(member => ({
        id: member.id,
        username: member.user.username,
        nickname: member.nickname,
        global: member.globalName,
        avatar: member.user.displayAvatarURL({ format: 'png', dynamic: true, size: 1024 }),
        roles: member.roles.cache.map(role => ({ id: role.id, name: role.name }))
      }));
      res.json(users);
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ error: 'Failed to fetch users', details: error.message });
    }
  });

app.post('/kick/:userId', async (req, res) => {
    try {
        const guild = client.guilds.cache.get(guildId);
        const member = await guild.members.fetch(req.params.userId);
        await member.kick('Kicked by admin');
        res.json({ success: true, message: 'User kicked successfully' });
    } catch (error) {
        console.error('Error kicking user:', error);
        res.status(500).json({ error: 'Failed to kick user' });
    }
});

app.post('/ban/:userId', async (req, res) => {
    try {
        const guild = client.guilds.cache.get(guildId);
        const member = await guild.members.fetch(req.params.userId);
        await member.ban({ reason: 'Banned by admin' });
        res.json({ success: true, message: 'User banned successfully' });
    } catch (error) {
        console.error('Error banning user:', error);
        res.status(500).json({ error: 'Failed to ban user' });
    }
});

// Endpoint to warn a user
app.post('/warn/:userId', async (req, res) => {
    const { userId } = req.params;
    const { message } = req.body;
  
    try {
      const user = await client.users.fetch(userId);
      await user.send(`The following message has been sent from the **FlyAway Administatrion Department** ---- ${message}`);
      res.status(200).send('User warned successfully');
    } catch (error) {
      console.error(error);
      res.status(500).send('Failed to warn user');
    }
  });

//Endpoint for new system with manage roles

app.get('/users/:userId', async (req, res) => {
    try {
      const guild = client.guilds.cache.get(guildId);
      const member = await guild.members.fetch(req.params.userId);
      const user = {
        id: member.id,
        username: member.user.username,
        nickname: member.nickname,
        avatar: member.user.displayAvatarURL({ format: 'png', dynamic: true, size: 1024 }),
        roles: member.roles.cache.map(role => ({ id: role.id, name: role.name }))
      };
      res.json(user);
    } catch (error) {
      console.error('Error fetching user:', error);
      res.status(500).json({ error: 'Failed to fetch user' });
    }
  });
  
  app.get('/roles', async (req, res) => {
    try {
      const guild = client.guilds.cache.get(guildId);
      const roles = guild.roles.cache.map(role => ({ id: role.id, name: role.name }));
      res.json(roles);
    } catch (error) {
      console.error('Error fetching roles:', error);
      res.status(500).json({ error: 'Failed to fetch roles' });
    }
  });
  
  app.post('/users/:userId/roles', async (req, res) => {
    try {
      const guild = client.guilds.cache.get(guildId);
      const member = await guild.members.fetch(req.params.userId);
      const { roles } = req.body;
  
      await member.roles.set(roles);
      res.json({ success: true, message: 'Roles updated successfully' });
    } catch (error) {
      console.error('Error updating roles:', error);
      res.status(500).json({ error: 'Failed to update roles' });
    }
  });
  
  app.get('/students', async (req, res) => {
    try {
      const guild = client.guilds.cache.get(guildId);
      const members = await guild.members.fetch();
      const students = members.filter(member => 
        member.roles.cache.has('1260981907227807754') || member.roles.cache.has('1289288863478583308') || member.roles.cache.has('1289288943782858752') || member.roles.cache.has('1289289000061763616') || member.roles.cache.has('1289289038485782549') || member.roles.cache.has('1289289119909941248') || member.roles.cache.has('1289289179561463849')
      ).map(member => ({
        id: member.id,
        username: member.user.username,
        nickname: member.nickname || member.user.username,
        avatarURL: member.user.displayAvatarURL({ format: 'png', dynamic: true, size: 256 })
        
      }));
      res.json(students);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch students' });
    }
  });



  // API route to get vCFIs
app.get('/vcfis', (req, res) => {
    const guild = client.guilds.cache.get('1260456606106259498');
    const vCFIRole = guild.roles.cache.get('1260981475369554004');
    const vCFIs = vCFIRole.members.map(member => ({
        id: member.id,
        username: member.user.username,
        nickname: member.nickname || member.user.username,
        avatarURL: member.user.displayAvatarURL({ format: 'png', dynamic: true, size: 256 })
    }));
    res.json(vCFIs);
});

app.post('/vcfis/:userId/toggle', async (req, res) => {
    try {
      const guild = client.guilds.cache.get('1260456606106259498');
      const member = await guild.members.fetch(req.params.userId);
      const vCFIRoleId = '1260981475369554004';
  
      if (member.roles.cache.has(vCFIRoleId)) {
        await member.roles.remove(vCFIRoleId);
      } else {
        await member.roles.add(vCFIRoleId);
      }
  
      res.json({ success: true, action: member.roles.cache.has(vCFIRoleId) ? 'added' : 'removed' });
    } catch (error) {
      console.error('Error toggling vCFI role:', error);
      res.status(500).json({ error: 'Failed to toggle vCFI role' });
    }
  });
  
  app.post('/student-reports', async (req, res) => {
    if (!global.studentReportConnection) {
        return res.status(503).json({ error: 'Student Report Database not connected' });
    }

    const Report = createReportModel(global.studentReportConnection);

    try {
        const report = new Report(req.body);
        const savedReport = await report.save();

        const guild = client.guilds.cache.get(guildId);
        const student = await client.users.fetch(req.body.studentId);
        const instructor = await guild.members.fetch(req.body.instructorId);
        const member = await guild.members.fetch(req.body.studentId);

        const reportMessage = `
  **New Student Report!!**
  
  **Student:** ${student}
  **vCFI**: ${instructor.nickname || instructor.user.username}
  
  **Session Type** -- ${req.body.sessionType}
  
  **Callsign:** ${req.body.callsign}
  **Departure Airport:** ${req.body.departureAirport}
  **Arrival Airport:** ${req.body.arrivalAirport}
  
  **ATC Services Online:** ${req.body.atcServices.join(', ')}
  
  -- **GRADED FLIGHT SKILL ON A SCALE OF 1 TO 10** --
  
  **Radio Communication:** ${req.body.radioCommunication}/10
  **Preflight Planning:** ${req.body.preflightPlanning}/10
  **Departure Score:** ${req.body.departureScore}/10
  **Approach and Landing:** ${req.body.approachLanding}/10
  
  **Final Notes from ${instructor.nickname || instructor.user.username}:** ${req.body.finalNotes}
  
  ${req.body.nextRating && req.body.nextRating !== 'notYet' ? `**Next Session Assigned:** ${req.body.nextRating}` : ''}
        `;

        await student.send(reportMessage);

        const studentReportsChannel = await guild.channels.fetch('1261386638366343208');
        await studentReportsChannel.send(reportMessage);

        const promote = req.body.nextRating && req.body.nextRating !== 'Re-doing Same Session';

        if (promote) {
            await updateDiscordRoles(req.body.studentId, req.body.sessionType, req.body.nextRating, promote);
        } else if (req.body.nextRating === 'Re-doing Same Session') {
            const previousRating = getPreviousRating(req.body.sessionType);
            await updateDiscordRoles(req.body.studentId, previousRating, req.body.sessionType, false);
        }

        // **Skip nickname update if "Re-doing Same Session" is selected**
        if (req.body.nextRating !== 'Re-doing Same Session') {
            let newNickname = member.nickname || member.user.username;

            const allRatings = ['vSP', 'vPPL', 'vIR', 'vP1', 'vP2', 'vP3', 'iP1', 'iP2', 'iP3'];
            allRatings.forEach(rating => {
                const ratingPattern = new RegExp(`\\|\\s${rating}`, 'g');
                newNickname = newNickname.replace(ratingPattern, '');
            });

            newNickname = newNickname.trim();

            if (!newNickname.includes(`| ${req.body.sessionType}`)) {
                newNickname = `${newNickname} | ${req.body.sessionType}`;
            }

            await member.setNickname(newNickname);
        }

        res.json({ success: true, report: savedReport });
    } catch (error) {
        console.error('Error processing report:', error);
        res.status(500).json({ error: 'Failed to process report', details: error.message });
    }
});
  
app.get('/student-reports', async (req, res) => {
    if (!global.studentReportConnection) {
      return res.status(503).json({ error: 'Student Report Database not connected' });
    }
    const Report = createReportModel(global.studentReportConnection);
    try {
      const reports = await Report.find(req.query.studentId ? { studentId: req.query.studentId } : {});
      const guild = client.guilds.cache.get(guildId);
      const reportsWithNicknames = await Promise.all(reports.map(async report => {
        const studentMember = await guild.members.fetch(report.studentId);
        const instructorMember = await guild.members.fetch(report.instructorId);
        return {
          ...report.toObject(),
          studentNickname: studentMember.nickname || studentMember.user.username,
          instructorNickname: instructorMember.nickname || instructorMember.user.username
        };
      }));
      res.json(reportsWithNicknames);
    } catch (error) {
      console.error('Error fetching student reports:', error);
      res.status(500).json({ error: 'Failed to fetch student reports' });
    }
  });
  
  app.get('/student-reports/:reportId', async (req, res) => {
    if (!global.studentReportConnection) {
      return res.status(503).json({ error: 'Student Report Database not connected' });
    }
    const Report = createReportModel(global.studentReportConnection);
    try {
      const report = await Report.findById(req.params.reportId);
      if (!report) {
        return res.status(404).json({ error: 'Report not found' });
      }
      const guild = client.guilds.cache.get(guildId);
      const studentMember = await guild.members.fetch(report.studentId);
      const instructorMember = await guild.members.fetch(report.instructorId);
      const reportWithNicknames = {
        ...report.toObject(),
        studentNickname: studentMember.nickname || studentMember.user.username,
        instructorNickname: instructorMember.nickname || instructorMember.user.username
      };
      res.json(reportWithNicknames);
    } catch (error) {
      console.error('Error fetching student report:', error);
      res.status(500).json({ error: 'Failed to fetch student report' });
    }
  });

  app.get('/api/user-ratings/:userId', async (req, res) => {
    try {
      const userId = req.params.userId;
      const guild = client.guilds.cache.get(guildId);
      if (!guild) throw new Error('Guild not found');
      const member = await guild.members.fetch(userId);
      if (!member) throw new Error('Member not found');
     
      const ratings = [];
      if (member.roles.cache.has('1260981907227807754')) ratings.push('vStudent');
      if (member.roles.cache.has('1289288863478583308')) ratings.push('vP1');
      if (member.roles.cache.has('1289288943782858752')) ratings.push('vP2');
      if (member.roles.cache.has('1289289000061763616')) ratings.push('vP3');
      if (member.roles.cache.has('1289289038485782549')) ratings.push('iP1');
      if (member.roles.cache.has('1289289119909941248')) ratings.push('iP2');
      if (member.roles.cache.has('1289289179561463849')) ratings.push('iP3');

     
      res.json(ratings);
    } catch (error) {
      console.error('Error fetching user ratings:', error);
      res.status(500).json({ error: 'Failed to fetch user ratings', details: error.message });
    }
  });


// Instructor Resources
app.get('/instructor-resources', async (req, res) => {
  try {
    const InstructorResourceModel = InstructorResource(global.instructorResourcesConnection);
    const resources = await InstructorResourceModel.findOne();
    if (!resources) {
      return res.status(404).json({ error: 'Instructor Resources not found' });
    }
    res.json(resources);
  } catch (error) {
    console.error('Error fetching instructor resources:', error);
    res.status(500).json({ error: 'Failed to fetch instructor resources' });
  }
});

app.put('/instructor-resources', async (req, res) => {
  try {
    const InstructorResourceModel = InstructorResource(global.instructorResourcesConnection);
    const updatedResources = await InstructorResourceModel.findOneAndUpdate({}, req.body, { upsert: true, new: true });
    res.json(updatedResources);
  } catch (error) {
    console.error('Error updating instructor resources:', error);
    res.status(500).json({ error: 'Failed to update instructor resources' });
  }
});


// Get all FAQs
app.get('/faq', async (req, res) => {
  try {
    const FAQ = getFAQModel();
    const faqs = await FAQ.find().sort('order');
    res.json(faqs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch FAQs' });
  }
});

// Add a new FAQ
app.post('/faq', async (req, res) => {
  try {
    const FAQ = getFAQModel();
    const newFAQ = new FAQ(req.body);
    await newFAQ.save();
    res.status(201).json(newFAQ);
  } catch (error) {
    console.error('Error adding FAQ:', error);
    res.status(400).json({ error: 'Failed to add FAQ' });
  }
});

app.put('/faq/reorder', async (req, res) => {
  try {
    const FAQ = getFAQModel();
    const newOrder = req.body;
    for (let item of newOrder) {
      await FAQ.findByIdAndUpdate(item.id, { order: item.order });
    }
    res.status(200).json({ message: 'Order updated successfully' });
  } catch (error) {
    console.error('Error updating FAQ order:', error);
    res.status(500).json({ error: 'Failed to update FAQ order' });
  }
});

// Update an existing FAQ
app.put('/faq/:id', async (req, res) => {
  try {
    const FAQ = getFAQModel();

    const updatedFAQ = await FAQ.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedFAQ);
  } catch (error) {
    res.status(400).json({ error: 'Failed to update FAQ' });
  }
});

// Delete a FAQ
app.delete('/faq/:id', async (req, res) => {
  try {
    const FAQ = getFAQModel();

    await FAQ.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: 'Failed to delete FAQ' });
  }
});



app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}`);
});

//MODMAIL


const modSchema = require('./Schemas/modschema');
client.on(Events.MessageCreate, async message => {

    if (message.author.bot) return;

    const guild = client.guilds.cache.get(guildId);

    if (message.channel.type == ChannelType.DM) {

        const member = message.author;

        let data = await modSchema.findOne({ Guild: guild.id, User: member});

        if (!data) {
            modSchema.create({
                Guild: guild.id,
                User: member.id
            })
        }

        const posChannel = guild.channels.cache.find(c => c.name === `${message.author.id}`);

        if (posChannel) {

            const embed = new EmbedBuilder()
            .setColor("Blue")
            .setAuthor({ name: `${message.author.username}`, iconURL: `${message.author.displayAvatarURL()}`})
            .setDescription(`${message.content || 'No message provided'}`)

            if (message.attachments.size === 1) {
                embed.setImage(`${message.attachments.first()?.url}`);
            }

            posChannel.send({ embeds: [embed] });
            message.react(`📧`).catch(err => {return;})
            return;

        }

        const category = guild.channels.cache.get(categoryId);
        const channel = await guild.channels.create({
            name: message.author.id,
            type: ChannelType.GuildText,
            parent: category,
            topic: `A mail sent by ${message.author.tag}`
        })

        member?.send(`Your modmail conversation has been started in ${guild.name}. A Staff member will be with you shortly. I will let you know when someone answers!`).catch(err => {
            return;
        })

        const embed = new EmbedBuilder()
        .setTitle(`NEW MODMAIL`)
        .setColor("Blue")
        .setAuthor({ name: `${message.author.username}`, iconURL: `${message.author.displayAvatarURL()}`})
        .setDescription(`${message.content || 'No message provided'}`)
        .setTimestamp()
        .setFooter({ text: "Use the button below to close this mail"})

        if (message.attachments.size === 1) {
            try {
                embed.setImage(`${message.attachments.first()?.url}`);
            } catch {}
        }

        const button = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
            .setCustomId('button')
            .setStyle(ButtonStyle.Danger)
            .setLabel('Close')
            .setEmoji('🔐')
        )

        if (message.attachments.size > 1) {

            let url = [];
                
            await Promise.all(message.attachments.map(async image => {
                url.push(image.url)
            }))

            const m = await channel.send({ embeds: [embed], components: [button], content: `${url.join('\n')}` });
            m.pin();
        } else {
            const m = await channel.send({ embeds: [embed], components: [button] });
            m.pin();
        }
        
        message.react(`📧`).catch(err => {return;})


    }
})

client.on(Events.MessageCreate, async message => {

    if (message.channel.type === ChannelType.GuildText) {

        const guild = client.guilds.cache.get(guildId);

        let data = await modSchema.findOne({ Guild: guild.id, User: message.channel.name});
        if (!data) return;

        const colChannel = guild.channels.cache.find(c => c.name === `${data.User}`);
        if (message.channel !== colChannel) return;
        if (message.author.bot) return;

        const memberID = data.User;
        const member = await client.users.fetch(memberID);

        const embed = new EmbedBuilder()
        .setColor("Blue")
        .setAuthor({ name: `${message.author.username}`, iconURL: `${message.author.displayAvatarURL()}`})
        .setDescription(`${message.content || 'No message provided'}`)

        if (message.attachments.size === 1) {
            embed.setImage(`${message.attachments.first()?.url}`);
        }

        if (message.attachments.size > 1) {

            let url = [];
        
            await Promise.all(message.attachments.map(async image => {
                url.push(image.url)
            }))

            member?.send({ embeds: [embed], content: `${url.join('\n')}` }).catch(err => {
                return message.channel.send(`This user has their DMs off, I cannot dm them anything`)
            })

        }

        try {
            await member?.send({ embeds: [embed] });
            await message.react('📧');
        } catch {
            await message.react('❌');
        }

    }
})

client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.guild) return;
    if (interaction.customId == 'button') {

        const modal = new ModalBuilder()
        .setTitle("Closing Reason")
        .setCustomId('modal')

        const reason = new TextInputBuilder()
        .setCustomId('reason')
        .setRequired(true)
        .setLabel("Reason for closing")
        .setStyle(TextInputStyle.Short);

        const firstActionRow = new ActionRowBuilder().addComponents(reason)

        modal.addComponents(firstActionRow)
        return interaction.showModal(modal)
    }

    if (!interaction.isModalSubmit()) return;

    let data = await modSchema.findOne({ Guild: interaction.guild.id, User: interaction.channel.name});
    if (!data) return;

    const user = await client.users.fetch(data.User).catch( () => {} );

    if (interaction.customId === 'modal') {
        const reason = interaction.fields.getTextInputValue('reason') || "No reason provided";

        await interaction.reply({
            embeds: [{
                title: `Modmail Closed`,
                description: `
This modmail has been closed!
**Moderator:** ${interaction.user}
**Reason:**
>>> ${reason}`,
                color: 0x2196f3
            }]
        });

        user?.send({
            embeds: [{
                title: `Modmail Conversation Closed`,
                description: `Your modmail conversation in ${interaction.guild.name} has been closed by a FlyAway Staff Member. \n \nReason for closing: ${reason}`,
                color: 0x2196f3
            }]
        }).catch( async () => {
            await interaction.followUp({
                content: `I was unable to DM this user, they may have their DMs off!`,
            })
        });

        await new Promise(resolve => setTimeout(resolve, 5_000));

        const file = await createTranscript(interaction.channel, {
            limit: -1,
            returnBuffer: false,
            filename: `modmail-${interaction.channel.name}.html`,
        });

        let channel = client.channels.cache.get(transcriptChannelId);

        const tranembed = new EmbedBuilder()
        .setColor('Blue')
        .setTimestamp()
        .setTitle(`${interaction.channel.name}'s Modmail Transcript`)
        .setDescription('> Your transcript has finished compiling!')

        let msg = await channel.send({ files: [file] });

        const button = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
            .setLabel('• Open')
            .setURL(`https://mahto.id/chat-exporter?url=${msg.attachments.first()?.url}`)
            .setStyle(ButtonStyle.Link),

            new ButtonBuilder()
            .setLabel('• Download')
            .setURL(`${msg.attachments.first()?.url}`)
            .setStyle(ButtonStyle.Link)
        )

        await channel.send({ embeds: [tranembed], components: [button] });

        try {
            await interaction.channel.delete();
        } catch (error) {
            await interaction.channel.send({
                content: `I was unable to delete this channel, please delete it manually!`,
            })
        }
        
    }
})

