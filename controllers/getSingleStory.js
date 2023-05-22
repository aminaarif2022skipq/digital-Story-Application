const Story = require("../model/Story");
const Comment = require("../model/Comment");
const mongoose = require("mongoose");
const getSingleStory = async (req, res) => {
  const id = req.params.id;
  try {
    const foundStory = await Story.findById(id).exec();
    if (!foundStory) return res.sendStatus(404);
    //if user is accessing is his own story return the story
    if (foundStory.authorId === req.user.id)
      return res.status(200).json(foundStory);
    //if user is accessing someone else story
    if (foundStory.status === "private")
      return res.status(403).json({ message: "this story is private" });
    //find all of the comments that belong to foundStory
    const pipeline = [
      { $match: { storyId: new mongoose.Types.ObjectId(id) } },
      { $sort: { order: 1 } },
      { $lookup : { 
         from : 'users',
         localField : 'authorId',
         foreignField : '_id',
         as : 'user'
      }},
      { $project : { text : 1 , user : {
         username : 1
      }}},
    ];
    const foundComments = await Comment.aggregate(pipeline);
    // Convert the Mongoose document to a plain JavaScript object
    const plainStory = foundStory.toObject();
    plainStory.storyComments = foundComments;
    return res.status(200).json(plainStory);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

module.exports = getSingleStory;
