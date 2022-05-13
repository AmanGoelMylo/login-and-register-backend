require("dotenv").config();
require("./config/database").connect();
const jwt = require("jsonwebtoken");
const express = require("express");
const bcrypt = require("bcrypt");

const User = require("./model/user");
const Product = require("./model/product");
const Cart = require("./model/cart");
const Order = require("./model/order");
const auth = require("./middleware/auth");
const { json } = require("express");
const order = require("./model/order");

const app = express();

app.use(express.json());

app.get("/homePage", async (req, res) => {
  return res.status(200).send("Welcome To Mylo 'My Loved Ones' ! ");
});

app.post("/registerUSer", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!(username && email && password)) {
      return res.status(400).send("All input is required");
    }

    const oldUser = await User.findOne({ email });

    if (oldUser) {
      res
        .status(409)
        .send("User Already Exist. Please Login with different email id !");
    }

    encryptedPassword = await bcrypt.hash(password, 10);

    let user = await User.create({
      username,
      email: email.toLowerCase(),
      password: encryptedPassword,
    });

    user = JSON.parse(JSON.stringify(user));

    return res.status(201).json(user);
  } catch (err) {
    console.log(err);
  }
});

app.post("/loginUser", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!(email && password)) {
      return res.status(400).send("All input is required");
    }
    let user = await User.findOne({ email });

    user = JSON.parse(JSON.stringify(user));

    if (user && (await bcrypt.compare(password, user.password))) {
      return res.status(200).json(user);
    }
    return res.status(400).send("Invalid Credentials");
  } catch (err) {
    console.log(err);
  }
});

app.post("/updateUserDetails", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!(email && password)) {
      return res.status(400).send("All input is required");
    }

    let user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      user = await User.updateOne({ email }, { $set: { username } });
      user = JSON.parse(JSON.stringify(user));
      return res.status(200).json(user);
    }
  } catch (error) {
    console.log(error);
  }
});

app.post("/addNewProduct", async (req, res) => {
  try {
    const { productId, title, categories, price, size } = req.body;

    if (!(productId && title && categories && price && size)) {
      return res.status(400).send("All input is required");
    }

    const oldProduct = await Product.findOne({ productId });

    if (oldProduct) {
      return res
        .status(409)
        .send("Product Already Exist. Please Enter New Product");
    }

    let savedProduct = await Product.create({
      productId,
      title,
      categories,
      price,
      size,
    });
    savedProduct = JSON.parse(JSON.stringify(savedProduct));

    return res.status(200).json(savedProduct);
  } catch (error) {
    console.log(error);
  }
});

app.post("/updateProductDetails", async (req, res) => {
  try {
    const { productId, title, categories, price, size, inStock } = req.body;

    if (!(productId && title && categories && price && size && inStock)) {
      return res.status(400).send("All input is required");
    }

    const oldProduct = await Product.findOne({ productId });

    if (oldProduct) {
      let productDetailsNew = await Product.updateOne(
        { productId },
        { $set: { title, categories, price, size, inStock } }
      );
      productDetailsNew = JSON.parse(JSON.stringify(productDetailsNew));
      return res.status(200).json(productDetailsNew);
    }
  } catch (error) {
    console.log(error);
  }
});

app.delete("/deleteProduct", async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.productId);
    res.status(200).json("Product has been deleted...");
  } catch (err) {
    res.status(500).json(err);
  }
});

app.post("/createOrder", async (req, res) => {
  const productId = req.body;
  const email = req.body;
  try {
    if (!(productId && email)) {
      return res.status(400).send("PLease Enter productId !");
    }
    let product = await Product.findOne({ productId });
    let userInfo = await User.findOne({ email });
    console.log("-------->>>>>>>>>", product, userInfo);
    if (product && userInfo) {
      product = JSON.parse(JSON.stringify(product));
      userInfo = JSON.parse(JSON.stringify(userInfo));
      const order = Order.create({
        email: userInfo.email,
        products: { productId },
        amount: product.price,
      });
    } else {
      return res
        .status(400)
        .send("Product doesn't exist, Please add a valid product !");
    }
    return res.status(200).send(order);
  } catch (error) {
    console.log(error);
  }
});

module.exports = app;
