const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require('dotenv');
const http = require('http');
const socketIo = require('socket.io');

// Load environment variables
dotenv.config();
const authRoutes = require("./routes/auth");
const eventRoutes = require("./routes/event");

const app = express();
app.use(cors());
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: 'https://event-management-frontend-ruddy-eta.vercel.app/', // Frontend URL
    methods: ['GET', 'POST'],
  },
});
app.use((req, res, next) => {
  req.io = io;
  next();
});
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.log("MongoDB connection error: ", err));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);

// Start the server
server.listen(process.env.PORT || 5000, () => {
  console.log(`Server is running on port ${process.env.PORT || 5000}`);
});

// Attach io to the request object so it can be accessed in the controllers
app.use((req, res, next) => {
  req.io = io;  // Attaching io instance to the request object
  next();
});

io.on("connection", (socket) => {
  console.log("New user connected");

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});
