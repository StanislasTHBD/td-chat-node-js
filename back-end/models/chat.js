const mongoose = require('mongoose');

const chatSchema = mongoose.Schema({
  from: { type: String, required: true },
  msg: { type: String, required: true },
});

module.exports = mongoose.model('chat', chatSchema);