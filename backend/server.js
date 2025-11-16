const express = require("express");
const http = require("http");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const socketIO = require("socket.io");

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);

//create a socket server and attacth it to the HTTP server and allow any origin * to connect
const io = socketIO(server, {
  cors: { origin: "*" },
});

//when a user connects
io.on("connection", (socket) => {
  console.log("User connected:", socket.id); //socket.id is uique id given to each connected user

  if (!io.userSockets) io.userSockets = new Map();
  if (!io.socketToUser) io.socketToUser = new Map();

  socket.on("join", (payload) => {
    const userId = payload && payload.id ? payload.id : socket.id;
    const displayName =
      payload && payload.name ? payload.name : payload || "A user";

    // cancel any pending disconnect timer for this user
    if (io.disconnectTimers && io.disconnectTimers.has(userId)) {
      clearTimeout(io.disconnectTimers.get(userId));
      io.disconnectTimers.delete(userId);
    }

    // store display name
    if (!io.userNames) io.userNames = new Map();
    io.userNames.set(userId, displayName);

    let set = io.userSockets.get(userId);
    const firstConnection = !set || set.size === 0;
    if (!set) {
      set = new Set();
      io.userSockets.set(userId, set);
    }
    set.add(socket.id);
    io.socketToUser.set(socket.id, userId);

    if (firstConnection) {
      io.emit("user-join", `${displayName} joined the chat`);
    }

    const onlineUsers = io.userSockets.size;
    io.emit("stats", { onlineUsers });
  });

  // explicit leave (client initiated) - payload may be {id, name} or name
  socket.on("leave", (payload) => {
    const userId =
      payload && payload.id ? payload.id : io.socketToUser.get(socket.id);
    const displayName =
      payload && payload.name ? payload.name : payload || "{displayName}";
    if (userId && io.userSockets.has(userId)) {
      const set = io.userSockets.get(userId);
      set.delete(socket.id);
      io.socketToUser.delete(socket.id);

      if (set.size === 0) {
        if (!io.disconnectTimers) io.disconnectTimers = new Map();
        if (io.disconnectTimers.has(userId)) {
          clearTimeout(io.disconnectTimers.get(userId));
        }
        const nameForTimer = io.userNames.get(userId) || displayName;
        const t = setTimeout(() => {
          const cur = io.userSockets.get(userId);
          if (!cur || cur.size === 0) {
            io.userSockets.delete(userId);
            io.userNames.delete(userId);
            io.emit("user-leave", `${nameForTimer} left the chat`);
          }
          io.disconnectTimers.delete(userId);
        }, 2000);
        io.disconnectTimers.set(userId, t);
      }
    }

    const onlineUsers = io.userSockets.size;
    io.emit("stats", { onlineUsers });
  });

  //when user sends the message
  socket.on("message", async (data) => {
    // lazy-load Message
    try {
      const Message = require("./models/Message");
      const User = require("./models/User");
      // save to DB
      const msg = await Message.create({
        user: data.user,
        message: data.message,
      });
      // broadcast the saved message
      io.emit("message", {
        id: msg._id,
        user: msg.user,
        message: msg.message,
        time: msg.time,
      });

      // broadcast updated stats
      const totalMessages = await Message.countDocuments();
      const totalUsers = await User.countDocuments();
      io.emit("stats", { totalMessages, totalUsers });
    } catch (err) {
      console.error("Error saving message:", err);
    }
  });

  // handle socket disconnects
  socket.on("disconnect", () => {
    const userId = io.socketToUser.get(socket.id);

    if (userId && io.userSockets.has(userId)) {
      const set = io.userSockets.get(userId);
      set.delete(socket.id);
      io.socketToUser.delete(socket.id);

      if (set.size === 0) {
        // start a short timer before declaring the user gone to handle quick refreshes
        if (!io.disconnectTimers) io.disconnectTimers = new Map();
        if (io.disconnectTimers.has(userId)) {
          clearTimeout(io.disconnectTimers.get(userId));
        }
        const nameForTimer = io.userNames.get(userId) || "A user";
        const t = setTimeout(() => {
          const cur = io.userSockets.get(userId);
          if (!cur || cur.size === 0) {
            io.userSockets.delete(userId);
            io.userNames.delete(userId);
            io.emit("user-leave", `${nameForTimer} left the chat`);
          }
          io.disconnectTimers.delete(userId);
        }, 2000);
        io.disconnectTimers.set(userId, t);
      }
    }

    const onlineUsers = io.userSockets.size;
    io.emit("stats", { onlineUsers });
  });
});

//any req to /api/auth go to routes/auth.js
app.use("/api/auth", require("./routes/auth"));
app.use("/api/chat", require("./routes/chat"));

//database connect
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

//Start the Server
server.listen(process.env.PORT, () =>
  console.log(`server running on ${process.env.PORT}`)
);
