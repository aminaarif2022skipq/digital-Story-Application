const requestBodySchema = require("../model/RequestBodySchema/updateStory");
const Story = require('../model/Story');

const updateStory = async (req,res) => {
     const projection = {
        createdAt: 0,
        updatedAt: 0,
        __v : 0
     }
     
     const {error , value} = requestBodySchema.validate(req.body);
     if (error) return res.status(400).json({ error: error.details[0].message });
     const storyId = req.params.id;
     
     try{
        const foundStory = await Story.findById(storyId).exec();
        if(!foundStory) return res.status(404).json('story not found');

        if(foundStory.authorId.toString() === req.user.id){

           const updatedStory = await Story.findByIdAndUpdate(storyId,{
               $set : value
           },{ 
               'returnDocument' : 'after',
               'select' : projection
           })
           return res.status(200).json(updatedStory);
        } else {
          return res.status(403).json({message : 'user is not allowed to update the story'});
        }
     } catch(err){
        return res.status(500).json({ error : err.message});
     }
     
     
}

module.exports = updateStory;