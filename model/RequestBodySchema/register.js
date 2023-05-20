const Joi = require("joi");

const schema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  username: Joi.string().alphanum().min(3).max(30).required(),
  password: Joi.string()
    .pattern(new RegExp('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$')),
  email: Joi.string().email({ minDomainSegments: 2 }).required(),
});

module.exports = schema;
