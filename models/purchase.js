const mongoose = require("mongoose");
const { Schema } = mongoose;

const purchaseSchema = new Schema({
  productId: { type: Schema.Types.ObjectId, ref: "Product" },
  userId: { type: Number, default: 1 },
  quantity: Number,
});

module.exports.Purchase = mongoose.model("Purchase", purchaseSchema);
