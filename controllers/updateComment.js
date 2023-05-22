const Joi = require('joi');
const Comment = require('../model/Comment');

const schema = Joi.object({
    text : Joi.string().required()
})

const updateComment = async (req,res) => {
     const commentId = req.params.id;
     const {error,value} = schema.validate(req.body);
     if (error) return res.status(400).json({ error: error.details[0].message });
     const projection = {
        createdAt : 0,
        updatedAt : 0
     }
     try{
        const foundComment = await Comment.findById(commentId,projection).exec();
        if(!foundComment)  return res.status(404).json('comment : not found');
        if(req.user.id === foundComment.authorId.toString()){
             foundComment.text = value.text;
             const updatedComment = await foundComment.save();
             if(updatedComment.text !== value.text) return res.status(500).json({ message : 'comment : update unsuccessfull'});
             return res.status(200).json(updatedComment);
        } else {
            return res.status(403).json({ message : 'user is not allowed to update this comment'});
        }
     }catch(err){
        return res.status(500).json({ message : err.message})
     }
}

module.exports = updateComment;