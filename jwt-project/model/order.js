const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  products: [
    {
      productId: {
        type: String,
      },
      quantity: {
        type: Number,
        default: 1,
      },
    },
  ],
  amount: { type: Number, required: true },
  // status: { type: String, default: "pending" },
});

module.exports = mongoose.model("Order", OrderSchema);
