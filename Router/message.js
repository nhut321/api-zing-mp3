const express = require("express");
const router = express.Router();
const Message = require('../Model/Message')

router.get('/get-chat', async (req, res) => {
    try {
        const messages = await Message.find({})
          .sort({ timestamp: -1 }) // Sắp xếp theo thời gian giảm dần
          .limit(10); // Giới hạn kết quả trả về là 10
        res.json(messages);
      } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ message: 'Error fetching messages', error });
      }
  });

module.exports = router
