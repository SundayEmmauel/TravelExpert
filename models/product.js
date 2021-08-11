const mongoose = require("mongoose");
const { Schema } = mongoose;

const productSchema = new Schema({
  name: { type: String, required: "Please enter the product name." }, // String is shorthand for {type: String}
  price: {
    type: Number,
    min: [0, "Price must be positive number."],
    required: "Please enter the price.",
  },
  description: String,
  image: String,
});

module.exports.Product = mongoose.model("Product", productSchema);
