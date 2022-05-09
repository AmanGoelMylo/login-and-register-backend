require("dotenv").config();
require("./config/database").connect();
const jwt = require("jsonwebtoken");
const express = require("express");
const User = require("./model/user");
const auth = require("./middleware/auth");
const bcrypt = require("bcrypt");
const user = require("./model/user");
const { db } = require("./model/user");

const app = express();

app.use(express.json());

app.get("/welcome", async (req, res) => {
  return res.status(200).send("Welcome 🙌 ");
});

app.post("/register", async (req, res) => {
  try {
    const { first_name, last_name, email, password } = req.body;

    if (!(email && password && first_name && last_name)) {
      return res.status(400).send("All input is required");
    }

    const oldUser = await User.findOne({ email });

    if (oldUser) {
      res.status(409).send("User Already Exist. Please Login");
    }

    encryptedPassword = await bcrypt.hash(password, 10);

    let user = await User.create({
      first_name,
      last_name,
      email: email.toLowerCase(),
      password: encryptedPassword,
    });

    user = JSON.parse(JSON.stringify(user));

    const token = await jwt.sign({ email: user.email }, process.env.TOKEN_KEY, {
      expiresIn: "2h",
    });

    user.token = token;

    return res.status(201).json(user);
  } catch (err) {
    console.log(err);
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!(email && password)) {
      return res.status(400).send("All input is required");
    }
    let user = await User.findOne({ email });
    console.log("----------<<<<", user);

    user = JSON.parse(JSON.stringify(user));

    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign(
        { user_id: user._id, email },
        process.env.TOKEN_KEY,
        {
          expiresIn: "2h",
        }
      );
      user.token = token;

      return res.status(200).json(user);
    }
    return res.status(400).send("Invalid Credentials");
  } catch (err) {
    console.log(err);
  }
});

app.post("/fetchUserDetails", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!(email && password)) {
      return res.status(400).send("All input is required");
    }
    let user = await User.findOne({ email });
    console.log("----------<<<<", user);

    if (user && (await bcrypt.compare(password, user.password))) {
      user = JSON.parse(JSON.stringify(user));
      return res.status(200).json(user);
    }
  } catch (error) {
    console.log(error);
  }
});

app.post("/updateUser", async (req, res) => {
  try {
    const { email, password, first_name, last_name } = req.body;
    if (!(email && password)) {
      return res.status(400).send("All input is required");
    }

    let user = await User.findOne({ email });

    console.log("---->>>>>", user);

    if (user && (await bcrypt.compare(password, user.password))) {
      user = await User.updateOne(
        { email },
        { $set: { first_name, last_name } }
      );
      //   user = JSON.parse(JSON.stringify(user));
      return res.status(200).json(user);
    }

    console.log("***********<", user);
  } catch (error) {
    console.log(error);
  }
});

app.post("/addCommentByUser", async (req, res) => {
  const { email, password, comment } = req.body;
  if (!(email && password && comment)) {
    return res.status(400).send("All Input is Required.");
  }

  let user = await User.findOne({ email });

  if (user && (await bcrypt.compare(password, user.password))) {
    user = await User.updateOne(
      { email: email },
      { $set: { comment: comment } }
    );
    //   user = JSON.parse(JSON.stringify(user));
    // user = await User.findOne({ email });
    return res.status(200).json(user);
  }
});

module.exports = app;
