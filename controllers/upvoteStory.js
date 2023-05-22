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
    const options = { session };
    let foundStory = await Story.findById(id, projection, options).exec();

    if (!foundStory) throw new Error("story not found");
    const noOfUpvotes = foundStory.upvotes;
    foundStory.upvotes += 1;
    const savedStory = await foundStory.save(options);
    if (!savedStory || savedStory.upvotes !== noOfUpvotes + 1)
      throw new Error("story : unsuccessfull updation");
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
      const newReaction = await Reaction.create(
        [
          {
            storyId: new mongoose.Types.ObjectId(id),
            userId: new mongoose.Types.ObjectId(req.user.id),
            reactionType: "upvote",
          },
        ],
        { session }
      );
      if (!newReaction) throw new "reaction : creation failed"();
    } else {
      foundReactionDownvote.reactionType = "upvote";
      let updatedReaction = await foundReactionDownvote.save(options);
      if (!updatedReaction || updatedReaction.reactionType !== "upvote") {
        throw new Error("reaction : unsuccessful update");
      }
      const noOfdownvotes = foundStory.downvotes;
      foundStory.downvotes -= 1;
      const savedStory = await foundStory.save(options);
      if (!savedStory || savedStory.downvotes !== noOfdownvotes - 1)
        throw new Error("story : unsuccessfull updation");
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
module.exports = upvoteStory;
