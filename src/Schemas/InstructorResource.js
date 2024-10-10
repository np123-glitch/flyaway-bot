const mongoose = require('mongoose');

const instructorResourceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  text: { type: String, required: true } // Store as Markdown
});

const InstructorResource = (connection) => {
  return connection.model('InstructorResource', instructorResourceSchema);
};

module.exports = InstructorResource;
