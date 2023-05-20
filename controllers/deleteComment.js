const mongoose = require('mongoose');
const Comment = require('../model/Comment');
const Reaction = require('../model/Reaction');
const Story = require('../model/Story');

const deleteComment = async (req,res) => {
     const commentId = req.params.id;
     const isValid = mongoose.Types.ObjectId.isValid(commentId);

     if(!isValid) return res.status(400).json({ message : 'invalid comment id'});
     let foundComment,commentCount;

    try{
        foundComment = await Comment.findById(commentId).exec();
        if(!foundComment) return res.sendStatus(404);
    }catch(err){
        return res.status(500).json({message : err.message});
    }
    
    if(req.user.id !== foundComment.authorId.toString()) return res.status(403).json({ message : 'invalid delete operation'});
   
    
    const session = await mongoose.startSession();
    session.startTransaction();
    try{
        const foundStory = await Story.findById(foundComment.storyId,{session});
        if(!foundStory) throw new Error('story not found');

        if(foundStory.comments > 0){
            foundStory.comments -= 1;
            await foundStory.save({session});
        }
       
        
        const result = await foundComment.deleteOne({session});
        console.log(result);

        commentCount = await Comment.countDocuments({ storyId : foundComment.storyId , authorId : foundComment.authorId},{session});
    
        if(commentCount === 0){
           await Reaction.deleteOne({
                storyId  : foundComment.storyId,
                userId : req.user.id,
                reactionType : 'comment',
            },{session});
        }
        
        await session.commitTransaction();
        console.log('transaction committed');

        return res.status(200).json({ message : 'comment deleted successfully'});
    }catch(err){
       await session.abortTransaction();
       return res.status(500).json({message : err.message});
    }finally{
        await session.endSession();
    }
}
module.exports = deleteComment;