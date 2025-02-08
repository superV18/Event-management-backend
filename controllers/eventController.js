const Event = require("../models/Event");

const createEvent = async (req, res) => {
  const { name, description, date } = req.body;
  const userId = req.user.id;

  try {
    const newEvent = new Event({ name, description, date, owner: userId });
    await newEvent.save();
    
    // Emit event creation event to notify all clients
    req.io.emit("eventCreated", newEvent);
    
    res.status(201).json(newEvent);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

const getEvents = async (req, res) => {
  try {
    const events = await Event.find()
      .populate("owner", "name")
      .populate("attendees", "name");
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

const addAttendee = async (req, res) => {
  const { eventId } = req.body;
  const userId = req.user.id;

  try {
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });

    // Prevent duplicate attendance
    if (event.attendees.includes(userId)) {
      return res.status(400).json({ message: "Already attending this event" });
    }

    event.attendees.push(userId);
    await event.save();

    // Emit attendee update to notify all clients
    req.io.emit("attendeeJoined", {
      eventId,
      attendeeCount: event.attendees.length,
    });

    res.json({ message: "Successfully joined the event" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { createEvent, getEvents, addAttendee };
