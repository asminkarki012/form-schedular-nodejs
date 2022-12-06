const router = require("express").Router();
const User = require("../models/User");
const Form = require("../models/Form");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const tokenList = {};

// 401 Unauthorized
// 400 Bad Request
// 403 Forbidden
// 404 Not Found
// 500 Internal Server Error

//Register
router.post("/signup", async (req, res) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPass = await bcrypt.hash(req.body.password, salt);

  try {
    const newUser = new User({
      email: req.body.email,
      password: hashedPass,
    });
    const newForm = new Form({
      email: req.body.email,
    });

    const user = await newUser.save();

    //setting up form db with Email
    const form = await newForm.save();
    res.status(200).json({
      message: `<p class="text-blue-500">${user.email} sign up successfully</p>`,
      data: user,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: `<p class="text-red-500">${err.message}</p>` });
  }
});

//login

router.post("/signin", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(400).json({
        message: `<p class="text-red-500">User Doesnot Exists!! Please SignUp First</p>`,
      });
    }
    const validated = await bcrypt.compare(req.body.password, user.password);
    if (!validated) {
      return res
        .status(400)
        .json({ message: `<p class="text-red-500">wrong credential!</p>` });
    }
    // console.log(user);
    const { password, ...other } = user._doc;
    const accessToken = jwt.sign({ user: other }, "secretkey", {
      expiresIn: "50s",
    });

    const refreshToken = jwt.sign({ user: other }, "refreshtokensecret", {
      expiresIn: "1h",
    });

    const response = {
      accessToken: accessToken,
      refreshToken: refreshToken,
    };

    tokenList[refreshToken] = response;
    // console.log(tokenList);

    res.status(200).json({
      message: `<p class="text-blue-500">${user.email} sign in successfully</p>`,
      data: other,
      accessToken,
      refreshToken
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: `<p class="text-red-500">${err.message}</p>` });
  }
});

//refresh token
router.post("/token", async (req, res) => {
  // in body email and refresh token is required 

  const postData = req.body;
  const user = await User.findOne({ email: postData.email });
  const { password, ...other } = user._doc;
  // console.log(tokenList);

  if (postData.refreshToken && postData.refreshToken in tokenList) {
    const accessToken = jwt.sign({ user: other }, "secretkey", { expiresIn: "50s" });
    const response = {
      accessToken: accessToken,
    };
    tokenList[postData.refreshToken].accessToken = accessToken;
    res.status(200).json({ response, msg: "Refresh JWT working" });
  } else {
    res.status(403).json("Forbidden");
  }
});

module.exports = router;
