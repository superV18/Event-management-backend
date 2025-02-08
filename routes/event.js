// routes/event.js
const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const { createEvent, getEvents, addAttendee } = require("../controllers/eventController");

router.post("/", authMiddleware, createEvent);
router.get("/", getEvents);
router.post("/join", authMiddleware, addAttendee);

module.exports = router;
