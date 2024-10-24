const { ActivityType } = require("discord.js");
const mongoose = require('mongoose');
const Exam = require('../Schemas/Exam');
const ExamAttempt = require('../Schemas/ExamAttempt');
const ExamAssignment = require('../Schemas/ExamAssignment');

const modmailMongoURL = process.env.MONGODBURL;
const studentReportMongoURL = process.env.MONGODB_URI;
const examDBURI = process.env.EXAM_DB_URI;

module.exports = {
  name: 'ready',
  once: true,
  async execute(client) {
    console.log('FlyAway Bot is now online!');

    if (!modmailMongoURL) return;

    // Modmail Database Connection
    mongoose.connect(modmailMongoURL || '', {
    }).then(() => {
      console.log('FlyAway is connected to the Modmail Database!');
    }).catch((error) => {
      console.log("FlyAway Bot is unable to connect to the Modmail Database:", error);
    });

    // Student Report Database Connection
    if (studentReportMongoURL) {
      try {
        const studentReportConnection = await mongoose.createConnection(studentReportMongoURL, {
        });
        console.log('FlyAway is connected to the Student Report Database!');
        global.studentReportConnection = studentReportConnection;
      } catch (error) {
        console.error("FlyAway Bot is unable to connect to the Student Report Database:", error);
      }
    }

    // Instructor Resources Database Connection
    if (process.env.INSTRUCTOR_RESOURCES_MONGODB_URI) {
      try {
        const instructorResourcesConnection = await mongoose.createConnection(process.env.INSTRUCTOR_RESOURCES_MONGODB_URI, {
        });
        console.log('FlyAway is connected to the Instructor Resources Database!');
        global.instructorResourcesConnection = instructorResourcesConnection;
      } catch (error) {
        console.error("FlyAway Bot is unable to connect to the Instructor Resources Database:", error);
      }
    }



    // FAQ Database Connection
if (process.env.FAQ_MONGODB_URI) {
  try {
    const faqConnection = await mongoose.createConnection(process.env.FAQ_MONGODB_URI, {});
    console.log('FlyAway is connected to the FAQ Database!');
    global.faqConnection = faqConnection;
  } catch (error) {
    console.error("FlyAway Bot is unable to connect to the FAQ Database:", error);
  }
}

    try {
      client.user.setStatus("online");
      client.user.setActivity("FlyAway students train!", {
        type: ActivityType.Watching,
      });
    } catch (error) {
      console.error(error);
    }
  },
};