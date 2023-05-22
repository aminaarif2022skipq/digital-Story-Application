const mongoose = require("mongoose");
const Story = require("../model/Story");
const Comment = require("../model/Comment");
const Reaction = require("../model/Reaction");
const deleteStory = async (req, res) => {
  const storyId = req.params.id;
  let status = 500;
  //verify wether  the id is valid
  const isValid = mongoose.Types.ObjectId.isValid(storyId);
  if (!isValid) return res.status(400).json("invalid story Id");

  try {
    //find the story if doesn't exist return 404
    const foundStory = await Story.findOne({ _id: storyId }).exec();
    if (!foundStory) return res.sendStatus(404);

    if (foundStory.authorId.toString() !== req.user.id)
      return res.status(403).json("user can only delete his/her own story");

    //start a transaction
    const session = await mongoose.startSession();
    await session.startTransaction();
    try {
      //first delete all comments for that story
      const responseComm = await Comment.deleteMany({ storyId }, { session }).exec();
      if(responseComm.deletedCount === 0){
         console.log('no comment found');
      }
      // delete all reactions for a story
      const responseReaction = await Reaction.deleteMany({ storyId }, { session }).exec();
      if(responseReaction.deletedCount === 0){
        console.log('no reaction found');
      }
      // finally delete the story
      const response = await Story.deleteOne({ _id: storyId }, { session }).exec();
      if(response.deletedCount === 0){
        throw new Error('unsuccessfull story deletion')
      }

      //commit the transaction
      await session.commitTransaction();
      console.log("transaction completed");
      //return successfull response
      res.status(200).json("story successfully deleted");
    } catch (err) {
      await session.abortTransaction();
      res.status(status).json({ message: err.message });
    } finally {
      await session.endSession();
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

module.exports = deleteStory;
