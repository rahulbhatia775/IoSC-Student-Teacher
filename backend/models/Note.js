const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema({
  subject: { type: String, required: true },
  title: { type: String, required: true },
  drive_link: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Note", noteSchema);
