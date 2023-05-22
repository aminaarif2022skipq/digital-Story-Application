const mongoose = require('mongoose');
const Comment = require('../model/Comment');
const Reaction = require('../model/Reaction');
const Story = require('../model/Story');

const deleteComment = async (req,res) => {
     const commentId = req.params.id;
     const USERID = req.user.id;
     const isValid = mongoose.Types.ObjectId.isValid(commentId);

     if(!isValid) return res.status(400).json({ message : 'invalid comment id'});
     let commentCount,status = 500;
    
     const session = await mongoose.startSession();
     session.startTransaction();
     try{
        const foundComment = await Comment.findOne({ _id : commentId},null,{session}).exec();
        if(!foundComment){
            status = 404;
            throw new Error('no comment was found');
        }
        
        const AUTHORID = foundComment.authorId.toString();
        if(USERID !== AUTHORID) {
            status = 403;
            throw new Error('invalid delete operation');
        }

        const foundStory = await Story.findById(foundComment.storyId,null,{session}).exec();
        if(!foundStory) {
            status = 404;
            //should all comments be deleted or not
            throw new Error('story not found');
        }

        if(foundStory.comments > 0){
            foundStory.comments -= 1;
            const updatedStory = await foundStory.save({session});
            if(updatedStory.comments !== foundStory.comments){
                status = 500;
                throw new Error('unsucessfull update operation');
            }
        }

        const response = await foundComment.deleteOne({session});
        if(response.deletedCount === 0){
            status = 500;
            throw new Error('unsucessfull delete operation');
        }

        commentCount = await Comment.countDocuments({ storyId : foundComment.storyId , authorId : foundComment.authorId},{session}).exec();
    
        if(commentCount === 0){
           const response = await Reaction.deleteOne({
                storyId  : foundComment.storyId,
                userId : req.user.id,
                reactionType : 'comment',
            },{session}).exec();
            if(response.deletedCount === 0){
                status = 500;
                throw new Error('unsucessfull delete operation');
            }
        }
        
        await session.commitTransaction();
        console.log('transaction committed');

        return res.status(200).json({ message : 'comment deleted successfully'});
    }catch(err){
       await session.abortTransaction();
       return res.status(status).json({message : err.message});
    }finally{
        await session.endSession();
    }
}
module.exports = deleteComment;