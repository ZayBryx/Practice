const mongoose = require("mongoose");

const BlackListToken = new mongoose.Schema({
  token: {
    type: String,
    unique: true,
    required: true,
  },
  token_type: {
    type: String,
    enum: ["access", "refresh"],
  },
});

module.exports = mongoose.model("BlackListToken", BlackListToken);
