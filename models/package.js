const mongoose = require("mongoose");
const { Schema } = mongoose;

const packageSchema = new Schema({
  name: { type: String, required: "Please enter the package name." }, // String is shorthand for {type: String}
  price: {
    type: Number,
    min: [0, "Price must be positive number."],
    required: "Please enter the price.",
  },

  description: {
    type: String
  },

  image: String,
});

module.exports.Package = mongoose.model("Package", packageSchema);
