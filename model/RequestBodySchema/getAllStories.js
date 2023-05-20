const Joi = require("joi");
const allowedFieldsSchema = Joi.object({
  createdAt: Joi.number().valid(1, -1),
  upvotes: Joi.number().valid(1, -1),
  downvotes: Joi.number().valid(1, -1),
}).xor("createdAt", "upvotes", "downvotes");
const schema = Joi.object({
  sort: Joi.number().valid(0, 1),
  fields: allowedFieldsSchema.when("sort", {
    is: Joi.valid(1),
    then: Joi.required(),
    otherwise: Joi.forbidden(),
  }),
});

module.exports = schema;
