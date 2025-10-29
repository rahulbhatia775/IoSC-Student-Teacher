// const Note = require("../models/Note");

// exports.createNote = async (req, res) => {
//   try {
//     const { subject, title, drive_link } = req.body;
//     const note = await Note.create({ subject, title, drive_link });
//     res.status(201).json({ message: "Note uploaded successfully", note });
//   } catch (error) {
//     res.status(500).json({ message: "Error creating note", error });
//   }
// };

// exports.getAllNotes = async (req, res) => {
//   try {
//     const notes = await Note.find().sort({ createdAt: -1 });
//     res.json(notes);
//   } catch (error) {
//     res.status(500).json({ message: "Error fetching notes", error });
//   }
// };

// const Note = require("../models/Note");

// exports.uploadNote = async (req, res) => {
//   try {
//     const { title, subject, driveLink } = req.body;
//     if (!title || !subject || !driveLink) {
//       return res.status(400).json({ message: "All fields are required" });
//     }

//     const note = new Note({
//       title,
//       subject,
//       driveLink,
//       file: req.file ? req.file.filename : null,
//     });

//     await note.save();
//     res.status(200).json({ message: "Note uploaded successfully", note });
//   } catch (error) {
//     console.error("Upload Note Error:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };

// exports.getNotes = async (req, res) => {
//   try {
//     const notes = await Note.find();
//     res.status(200).json(notes);
//   } catch (error) {
//     res.status(500).json({ message: "Failed to fetch notes" });
//   }
// };


// backend/controllers/notesController.js

exports.uploadNote = (req, res) => {
  try {
    const { title, subject, driveLink } = req.body;

    // simple validation
    if (!title || !subject || !driveLink) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // (Here you’d normally save to MongoDB — for now just send success)
    res.status(200).json({
      message: "Note uploaded successfully",
      data: { title, subject, driveLink },
    });
  } catch (error) {
    console.error("❌ Error in uploadNote:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getNotes = (req, res) => {
  try {
    // (Later: fetch from DB)
    res.status(200).json([
      { title: "Sample Note", subject: "Physics", driveLink: "https://drive.google.com" },
    ]);
  } catch (error) {
    console.error("❌ Error fetching notes:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
