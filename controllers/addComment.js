const Joi = require('joi');
const Story = require('../model/Story');
const Comment = require('../model/Comment');
const Reaction = require('../model/Reaction');
const mongoose = require('mongoose');

const schema = Joi.object({
    text : Joi.string().required()
});

const addComment = async (req,res) => {
    let foundStory,foundReaction;
    const storyId = req.params.id;
    
    const isValid = mongoose.Types.ObjectId.isValid(storyId);
    if (!isValid) return res.status(400).json({ message: "story id invalid" });
    
    const { error , value } = schema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });
    
    const reaction = {
        storyId : new mongoose.Types.ObjectId(storyId),
        userId :  new mongoose.Types.ObjectId(req.user.id),
        reactionType : 'comment'
    }

    try{
        foundStory = await Story.findById(storyId);
        if(!foundStory) return res.status(404).json({ message : `story with ${storyId} is not found`});
        foundReaction = await Reaction.findOne(reaction);
    }catch(err){
        res.status(500).json({ message : err.message});
    }

    const newComment = {
        storyId,
        text : value.text,
        authorId : req.user.id,
        order : await Comment.countDocuments({ storyId }) + 1
    }
    
    const session = await  mongoose.startSession();
    session.startTransaction();

    try{
       foundStory.comments += 1;
       await foundStory.save({session});

       await Comment.create([newComment],{session});
       res.status(201).json('comment : created');

       if(!foundReaction)
       await Reaction.create([reaction],{session});

       await session.commitTransaction();
       console.log('transaction commited');
    }catch(err){
        await session.abortTransaction();
        res.status(500).json({ message : err.message});
    }finally{
        await session.endSession();
    }

}

module.exports = addComment;