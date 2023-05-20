const mongoose = require("mongoose");
const Story = require("../model/Story");
const Comment = require("../model/Comment");
const Reaction = require("../model/Reaction");
const deleteStory = async (req, res) => {
  const storyId = req.params.id;
  //verify wether  the id is valid
  const isValid = mongoose.Types.ObjectId.isValid(storyId);
  if (!isValid) return res.status(400).json("invalid story Id");

  try {
    //find the story if doesn't exist return 404
    const foundStory = await Story.findOne({ _id: storyId });
    if (!foundStory) return res.sendStatus(404);

    if (foundStory.authorId.toString() !== req.user.id)
      return res.status(403).json("user can only delete his/her own story");

    //start a transaction
    const session = await mongoose.startSession();
    await session.startTransaction();
    try {
      //first delete all comments for that story
      await Comment.deleteMany({ storyId }, { session });
      // delete all reactions for a story
      await Reaction.deleteMany({ storyId }, { session });
      // finally delete the story
      await Story.deleteOne({ _id: storyId }, { session });

      //commit the transaction
      await session.commitTransaction();
      console.log("transaction completed");
      //return successfull response
      res.status(200).json("story successfully deleted");
    } catch (err) {
      await session.abortTransaction();
      res.status(500).json({ message: err.message });
    } finally {
      await session.endSession();
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

module.exports = deleteStory;
