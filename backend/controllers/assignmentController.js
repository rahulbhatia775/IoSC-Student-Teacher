// const Assignment = require("../models/Assignment");

// exports.createAssignment = async (req, res) => {
//   try {
//     const { subject, title, due_date, classroom_link } = req.body;
//     const assignment = await Assignment.create({ subject, title, due_date, classroom_link });
//     res.status(201).json({ message: "Assignment created successfully", assignment });
//   } catch (error) {
//     res.status(500).json({ message: "Error creating assignment", error });
//   }
// };

// exports.getAllAssignments = async (req, res) => {
//   try {
//     const assignments = await Assignment.find().sort({ createdAt: -1 });
//     res.json(assignments);
//   } catch (error) {
//     res.status(500).json({ message: "Error fetching assignments", error });
//   }
// };

// const path = require("path");
// const fs = require("fs");

// const uploadAssignment = (req, res) => {
//   if (!req.file) {
//     return res.status(400).json({ message: "No file uploaded" });
//   }

//   res.status(200).json({
//     message: "Assignment uploaded successfully",
//     filename: req.file.filename,
//   });
// };

// const getAllAssignments = (req, res) => {
//   const dir = path.join(__dirname, "../uploads");
//   const files = fs.readdirSync(dir);
//   res.json(files);
// };

// module.exports = { uploadAssignment, getAllAssignments };


// backend/controllers/assignmentController.js

exports.uploadAssignment = (req, res) => {
  const { title, subject, dueDate, classroomLink } = req.body;

  if (!title || !subject || !dueDate || !classroomLink) {
    return res.status(400).json({ message: "All fields are required" });
  }

  return res.status(200).json({ message: "Assignment uploaded successfully" });
};

exports.getAssignments = (req, res) => {
  return res.status(200).json([{ title: "Demo Assignment", subject: "Math" }]);
};
