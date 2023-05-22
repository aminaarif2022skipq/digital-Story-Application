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
    const options = { session };
    let foundStory = await Story.findById(id, projection, options).exec();

    if (!foundStory) throw new Error("story not found");
    const noOfdownvotes = foundStory.downvotes;
    foundStory.downvotes += 1;
    const savedStory = await foundStory.save(options);
    if (!savedStory || savedStory.downvotes !== noOfdownvotes + 1)
      throw new Error("story : unsuccessfull updation");

    const foundReactionUpvote = await Reaction.findOne(
      {
        storyId: new mongoose.Types.ObjectId(id),
        userId: new mongoose.Types.ObjectId(req.user.id),
        reactionType: "upvote",
      },
      null,
      options
    ).exec();

    if (!foundReactionUpvote) {
      const newReaction = await Reaction.create(
        [
          {
            storyId: new mongoose.Types.ObjectId(id),
            userId: new mongoose.Types.ObjectId(req.user.id),
            reactionType: "downvote",
          },
        ],
        options
      );
      if (!newReaction) throw new "reaction : creation failed"();
    } else {
      foundReactionUpvote.reactionType = "downvote";
      let updatedReaction = await foundReactionUpvote.save(options);
      if (!updatedReaction || updatedReaction.reactionType !== "downvote") {
        throw new Error("reaction : unsuccessful update");
      }
      const noOfUpvotes = foundStory.upvotes;
      foundStory.upvotes -= 1;
      const savedStory = await foundStory.save(options);
      if (!savedStory || savedStory.upvotes !== noOfUpvotes - 1)
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
module.exports = downvoteStory;
