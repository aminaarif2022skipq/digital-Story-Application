const bycypt = require("bcrypt");
const User = require("../model/User.js");
const requestBodySchema = require('../model/RequestBodySchema/register.js')

const createNewUser = async (req, res) => {
  try {
    const {error , value} =  requestBodySchema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    const {name , username , email , password} = value;
    //if already exists
    const foundUser = await User.findOne({ username }).exec();
    if (foundUser) {
      return res.sendStatus(409);
    }
    //encrypt the password
    const hashedPwd = await bycypt.hash(password, 10);
    //store the user in db
    const result = await User.create({
      name,
      username,
      password: hashedPwd,
      email,
    });
    //send the response back
    res.status(201).json("success : new user created");
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = createNewUser;
