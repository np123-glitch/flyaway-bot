const mongoose = require('mongoose');

const examSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['vPPL', 'vIR', 'vCFI'],
    required: true,
  },
  questions: [{
    text: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['multipleChoice', 'shortAnswer', 'trueFalse'],
      required: true,
    },
    options: [{
      type: String,
    }],
    answer: {
      type: Number, // Index of the correct option for multiple choice, or the correct answer for other types
      required: true,
    },
  }],
});

const Exam = mongoose.model('Exam', examSchema);

module.exports = Exam;
