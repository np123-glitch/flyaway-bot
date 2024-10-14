const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  _id: { type: String, required: true }, // Discord user ID
  username: { type: String, required: true },
  nickname: { type: String },
  roles: [{ type: String }],
  ratings: [{ type: String }],
}, { timestamps: true });

module.exports = userSchema;

