const Comment = require("../model/Comment");
const mongoose = require('mongoose');
const getComment = async (req, res) => {
  const commentId = req.params.id;

  const isValid = mongoose.Types.ObjectId.isValid(commentId);
  if(!isValid) return res.status(400).json({ message : 'invalid comment id'});
  
  const projection = {
    createdAt : 0,
    updatedAt : 0,
    __v : 0
  }
  try {
    const foundComment = await Comment.findById(commentId,projection).exec();
    if (!foundComment) return res.status(404).json("comment : not found");
    return res.status(200).json(foundComment);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

module.exports = getComment;
