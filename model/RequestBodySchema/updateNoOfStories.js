const Joi = require('joi');

const schema = Joi.object({
    totalNumberOfStories : Joi.number().required()
});

module.exports = schema;

