const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  studentId: String,
  instructorId: String,
  sessionType: String,
  callsign: String,
  departureAirport: String,
  arrivalAirport: String,
  atcServices: [String],
  radioCommunication: Number,
  preflightPlanning: Number,
  departureScore: Number,
  approachLanding: Number,
  finalNotes: String,
  nextRating: String, // New field for the next rating
  date: { type: Date, default: Date.now }
});

module.exports = (connection) => connection.model('Report', reportSchema);