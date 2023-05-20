const requestBodySchema = require("../model/RequestBodySchema/readReaction");
const mongoose = require("mongoose");
const Reaction = require("../model/Reaction");
const deleteReaction = async (req, res) => {
  const storyId = req.params.id;
  const { error, value } = requestBodySchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const isValidStoryId = mongoose.Types.ObjectId.isValid(storyId);

  if (!isValidStoryId)
    return res.status(400).json({ message: "invalid storyId" });

  const filter = {
    storyId: new mongoose.Types.ObjectId(storyId),
    userId: new mongoose.Types.ObjectId(req.user.id),
    reactionType: value.reactionType,
  };

  try {
      await Reaction.deleteOne(filter);
      res.status(200).json("delete : successful");
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

module.exports = deleteReaction;
