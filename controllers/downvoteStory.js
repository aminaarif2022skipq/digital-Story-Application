const Story = require("../model/Story");
const Reaction = require("../model/Reaction");
const mongoose = require("mongoose");
const downvoteStory = async (req, res) => {
  const projection = {
    createdAt: 0,
    updatedAt: 0,
  };
  const id = req.params.id;

  try {
    const foundReactionDownvote = await Reaction.findOne({
      storyId: new mongoose.Types.ObjectId(id),
      userId: new mongoose.Types.ObjectId(req.user.id),
      reactionType: "downvote",
    });
    if (foundReactionDownvote)
      return res.status(403).json({
        message: `reaction of type ${foundReactionDownvote.reactionType} already exists by user ${req.user.username}`,
      });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  //start transaction
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    let foundStory = await Story.findByIdAndUpdate(
      id,
      {
        $inc: { downvotes: 1 },
      },
      {
        returnDocument: "after",
        projection,
        session,
      }
    );

    const foundReactionUpvote = await Reaction.findOne(
      {
        storyId: new mongoose.Types.ObjectId(id),
        userId: new mongoose.Types.ObjectId(req.user.id),
        reactionType: "upvote",
      },
      null,
      { session }
    );

    if (!foundReactionUpvote) {
      await Reaction.create(
        [
          {
            storyId: new mongoose.Types.ObjectId(id),
            userId: new mongoose.Types.ObjectId(req.user.id),
            reactionType: "downvote",
          },
        ],
        { session }
      );
    } else {
      foundReactionUpvote.reactionType = "downvote";
      await foundReactionUpvote.save({ session });
      foundStory.upvotes -= 1;
      foundStory = await foundStory.save();
    }

    await session.commitTransaction();
    console.log("transaction committed");
    res.status(200).json(foundStory);
  } catch (err) {
    await session.abortTransaction();
    return res.status(500).json({ message: err.message });
  } finally {
    await session.endSession();
  }
};
module.exports = downvoteStory;
