const Joi = require("joi");

const schema = Joi.object({
  name: Joi.string().min(3).max(30),
  username: Joi.string().alphanum().min(3).max(30),
  password: Joi.string().pattern(
    new RegExp("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$")
  ),
  email: Joi.string().email({ minDomainSegments: 2 }),
}).or("name", "username", "password", "email");

module.exports = schema;
