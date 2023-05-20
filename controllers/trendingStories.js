const Story = require('../model/Story');
const Joi = require('joi');

const schema = Joi.object({
    upvotes : Joi.number().valid(1),
    comments : Joi.number().valid(1),
}).xor('upvotes','comments');


const trendingStories = async (req,res) => {
     const {error,value} = schema.validate(req.body);
     if (error) return res.status(400).json({ error: error.details[0].message });
     //get most upvoted and commented stories trending stories
     const pipeline = [
        { $match : { status : 'public'}},
        { $sort : { [value.upvotes ? 'upvotes' : 'comments'] : -1}}
     ]
     try{
        const trendingStories = await Story.aggregate(pipeline);
        return res.status(200).json(trendingStories);
     }catch(err){
       return res.status(500).json({ message : err.message});
     }
}

module.exports = trendingStories;