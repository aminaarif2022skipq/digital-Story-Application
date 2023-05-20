const Joi = require('joi');

const schema = Joi.object({
    reactionType : Joi.string().valid('upvote','downvote','comment')
})

module.exports = schema;