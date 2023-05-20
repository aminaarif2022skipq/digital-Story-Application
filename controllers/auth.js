const User = require("../model/User");
const bycrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const requestBodySchema = require("../model/RequestBodySchema/login");
require("dotenv").config();

const handleLogIn = async (req, res) => {
  const { error, value } = requestBodySchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  const { username, password } = value;
  try {
    const foundUser = await User.findOne({ username }).exec();
    if (!foundUser) {
      res.sendStatus(401);
      return;
    }
    const match = await bycrypt.compare(password, foundUser.password);
    if (match) {
      const accessToken = jwt.sign(
        { id : foundUser._id ,
          username : foundUser.username 
        },
        process.env.ACCESS_TOKEN_SECRET_KEY,
        { expiresIn: "30s" }
      );
      const refreshToken = jwt.sign(
        { username: username },
        process.env.REFRESH_TOKEN_SECRET_KEY,
        { expiresIn: "1d" }
      );

      foundUser.refreshToken = refreshToken;
      const result = await foundUser.save();

      res.cookie("jwt", refreshToken, {
        httpOnly: true,
        secure: process.env.ENVIRONMENT === "dev" ? false : true,
        maxAge: 24 * 60 * 60 * 1000,
      });

      res.json({ accessToken });
    } else {
      res.sendStatus(401);
      return;
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = handleLogIn;
