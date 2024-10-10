const mongoose = require('mongoose');

const examAssignmentSchema = new mongoose.Schema({
  studentId: {
    type: String,
    required: true,
  },
  examId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Exam',
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const ExamAssignment = mongoose.model('ExamAssignment', examAssignmentSchema);

module.exports = ExamAssignment;
