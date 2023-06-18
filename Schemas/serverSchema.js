const { Schema, model } = require("mongoose");

const serverSchema = new Schema({
    serverId: {
    type: String,
    required: true,
    unique: true,
  },
    serverName: {
    type: String,
    required: true,
  },
    categoryTicket: {
    type: String,
    required: false,
  },
    roleSupID: {
    type: String,
    required: false,
  }
});

module.exports = model("serverSchema", serverSchema);