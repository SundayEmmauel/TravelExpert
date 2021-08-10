// Using Node.js `require()`
// npm i mongoose
// npm i mongoose-unique-validator

const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const agentSchema = new mongoose.Schema({
  _id: Number,
  fname: {
    type: String,
    trim: true,
    default: "-",
  },
  lname: {
    type: String,
    trim: true,
  },
  registeredOn: {
    type: Date,
    default: new Date(),
  },
});

agentSchema.plugin(uniqueValidator);
// Create a model Agent using the agentSchema
module.exports.Agent = mongoose.model("Agent", agentSchema);
