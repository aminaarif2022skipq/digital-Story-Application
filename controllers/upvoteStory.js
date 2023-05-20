const Story = require("../model/Story");
const Reaction = require("../model/Reaction");
const mongoose = require("mongoose");
const upvoteStory = async (req, res) => {
  const projection = {
    createdAt: 0,
    updatedAt: 0,
  };
  const id = req.params.id;
  try {
    const foundReactionUpvote = await Reaction.findOne({
      storyId: new mongoose.Types.ObjectId(id),
      userId: new mongoose.Types.ObjectId(req.user.id),
      reactionType: "upvote",
    });
    if (foundReactionUpvote)
      return res.status(403).json({
        message: `reaction of type ${foundReactionUpvote.reactionType} already exists by user ${req.user.username}`,
      });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    let updatedStory = await Story.findByIdAndUpdate(
      id,
      {
        $inc: { upvotes: 1 },
      },
      {
        returnDocument: "after",
        projection,
      },
      { session }
    );

    const foundReactionDownvote = await Reaction.findOne(
      {
        storyId: new mongoose.Types.ObjectId(id),
        userId: new mongoose.Types.ObjectId(req.user.id),
        reactionType: "downvote",
      },
      null,
      { session }
    );

    if (!foundReactionDownvote) {
      await Reaction.create(
        [
          {
            storyId: new mongoose.Types.ObjectId(id),
            userId: new mongoose.Types.ObjectId(req.user.id),
            reactionType: "upvote",
          },
        ],
        { session }
      );
    } else {
      foundReactionDownvote.reactionType = "upvote";
      await foundReactionDownvote.save({ session });
      updatedStory.downvotes -= 1;
      updatedStory = await updatedStory.save();
    }
    await session.commitTransaction();
    console.log("transaction committed");
    res.status(200).json(updatedStory);
  } catch (err) {
    await session.abortTransaction();
    return res.status(500).json({ message: err.message });
  } finally {
    await session.endSession();
  }
};
module.exports = upvoteStory;
