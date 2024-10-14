const mongoose = require('mongoose');

const trainingRequestSchema = new mongoose.Schema({
  studentId: { type: String, required: true },
  trainingType: { type: String, required: true, enum: ['Targeted', 'Academy'] },
  requestedDateTime: { type: Date, required: true },
  status: { type: String, default: 'pending', enum: ['pending', 'accepted', 'completed', 'cancelled'] },
  studentNickname: { type: String },
  sessionType: { type: String },
  simulator: { type: String },
  aircraftType: { type: String },
  vatsimExperience: { type: String },
  flightLocation: { type: String },
  instructorId: { type: String },
  instructorNickname: { type: String },
  acceptedDateTime: { type: Date },
  extraComments: { type: String },
}, { timestamps: true });

module.exports = trainingRequestSchema;
