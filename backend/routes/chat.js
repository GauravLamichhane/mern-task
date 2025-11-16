const router = require("express").Router();
const Message = require("../models/Message");
const User = require("../models/User");
const auth = require("../middleware/authMiddleware");

// save message to DB
router.post("/", auth, async (req, res) => {
  const { user, message } = req.body;
  try {
    const msg = await Message.create({ user, message });
    res.status(201).json(msg);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

// get chat stats (total messages and users)
router.get("/stats", auth, async (req, res) => {
  try {
    const messageCount = await Message.countDocuments();
    const userCount = await User.countDocuments();
    res.json({ totalMessages: messageCount, totalUsers: userCount });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

// get recent messages
router.get("/messages", auth, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 50;
    const msgs = await Message.find().sort({ time: 1 }).limit(limit).lean();
    res.json(msgs);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
