// const express = require("express");
// const router = express.Router();
// const { createNote, getAllNotes } = require("../controllers/notesController");

// router.post("/", createNote);
// router.get("/", getAllNotes);
// // router.post('/upload', uploadControllerFunction);


// module.exports = router;

const express = require("express");
const router = express.Router();
const upload = require("../middleware/uploadMiddleware");
const { uploadNote, getNotes } = require("../controllers/notesController");

router.post("/upload", upload.single("file"), uploadNote);
router.get("/", getNotes);

module.exports = router;

