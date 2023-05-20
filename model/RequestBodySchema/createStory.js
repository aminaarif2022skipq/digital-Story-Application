const Joi = require('joi');

const createStory = Joi.object({
      title : Joi.string().required(),
      imgUrl : Joi.string().uri({ scheme: ['https'] }).required(),
      videoUrl : Joi.string().uri({ scheme: ['https'] }).required(),
      status : Joi.string().valid('public','private')
})

module.exports = createStory;