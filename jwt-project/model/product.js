const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  productId: { type: Number, unique: true },
  title: { type: String },
  categories: { type: String },
  price: { type: Number },
  size: { type: String },
  inStock: { type: Boolean, default: true },
});

module.exports = mongoose.model("Product", ProductSchema);
