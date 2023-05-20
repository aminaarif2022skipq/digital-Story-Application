const Joi = require('joi');

const updateStory = Joi.object({
      title : Joi.string(),
      imgUrl : Joi.string().uri({ scheme: ['https'] }),
      videoUrl : Joi.string().uri({ scheme: ['https'] }),
      status : Joi.string().valid('public','private')
})

module.exports = updateStory;