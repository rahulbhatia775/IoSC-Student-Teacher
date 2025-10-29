// const express = require("express");
// const router = express.Router();
// const { createAssignment, getAllAssignments } = require("../controllers/assignmentsController");

// router.post("/", createAssignment);
// router.get("/", getAllAssignments);

// module.exports = router;


// backend/routes/assignmentsRoutes.js
const express = require("express");
const router = express.Router();
const { uploadAssignment, getAssignments } = require("../controllers/assignmentController");

router.post("/upload", uploadAssignment);
router.get("/", getAssignments);

module.exports = router;
