const mongoose = require("mongoose");

const BlackListToken = new mongoose.Schema({
  token: {
    type: String,
    unique: true,
    required: true,
  },
});

module.exports = mongoose.model("BlackListToken", BlackListToken);
