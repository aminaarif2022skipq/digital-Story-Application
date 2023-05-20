const requestBodySchema = require("../model/RequestBodySchema/readReaction");
const mongoose = require("mongoose");
const Reaction = require("../model/Reaction");
const getReaction = async (req, res) => {
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
    const foundReaction = await Reaction.find(filter);
    if (foundReaction.length > 0) return res.status(200).json(foundReaction);
    else return res.status(404).json("data not found");
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

module.exports = getReaction;
