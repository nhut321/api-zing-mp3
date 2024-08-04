const Message = require('../models/messageModel');

exports.saveMessage = async (message) => {
  const newMessage = new Message(message);
  return await newMessage.save();
};