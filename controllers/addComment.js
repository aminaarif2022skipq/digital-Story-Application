const Joi = require("joi");
const Story = require("../model/Story");
const Comment = require("../model/Comment");
const Reaction = require("../model/Reaction");
const mongoose = require("mongoose");

const schema = Joi.object({
  text: Joi.string().required(),
});

const addComment = async (req, res) => {
  let status = 500,
    foundReaction;
  const storyId = req.params.id;

  const isValid = mongoose.Types.ObjectId.isValid(storyId);
  if (!isValid) return res.status(400).json({ message: "story id invalid" });

  const { error, value } = schema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const reaction = {
    storyId: new mongoose.Types.ObjectId(storyId),
    userId: new mongoose.Types.ObjectId(req.user.id),
    reactionType: "comment",
  };

  const newComment = {
    storyId,
    text: value.text,
    authorId: req.user.id,
    order: (await Comment.countDocuments({ storyId })) + 1,
  };

  foundReaction = await Reaction.findOne(reaction).exec();

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const updatedStory = await Story.findByIdAndUpdate(
      storyId,
      {
        $set: { comments: 1 },
      },
      {
        returnDocument: "after",
      }
    );

    if (!updatedStory) {
      status = 404;
      throw new Error("story not found");
    }

    const createdComment = await Comment.create([newComment], { session });
    if (createdComment.length === 0) {
      status = 400;
      throw new Error("no new comment was created");
    }

    if (!foundReaction) {
      const newReaction = await Reaction.create([reaction], { session });
      if (newReaction.length === 0) {
        status = 400;
        throw new Error("no new reaction was created");
      }
    }

    await session.commitTransaction();
    console.log("transaction commited");
    res.status(201).json('comment created successfully');
  } catch (err) {
    await session.abortTransaction();
    res.status(status).json({ message: err.message });
  } finally {
    await session.endSession();
  }
};

module.exports = addComment;
