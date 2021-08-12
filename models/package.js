const mongoose = require("mongoose");
const { Schema } = mongoose;

const packageSchema = new Schema({
  PkgName: { type: String, required: "Please enter the package name." }, // String is shorthand for {type: String}
  PkgBasePrice: {
    type: Number,
    min: [0, "Price must be positive number."],
    required: "Please enter the price.",
  },
  PkgStartDate: {
    type: String,
    PkgStartDate: Date(),
    PkgEndDate: Date(+4)
  },
  PkgDesc: String,
  image: String,
});

module.exports.Package = mongoose.model("Package", packageSchema);
