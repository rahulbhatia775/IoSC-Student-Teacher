const mongoose = require("mongoose");

const assignmentSchema = new mongoose.Schema({
  subject: { type: String, required: true },
  title: { type: String, required: true },
  due_date: { type: Date, required: true },
  classroom_link: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Assignment", assignmentSchema);

