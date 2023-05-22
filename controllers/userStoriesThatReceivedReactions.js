const mongoose = require("mongoose");
const Story = require("../model/Story");

const reactionsRecieved = async (req, res) => {
  const userId = req.user.id;
  const isValid = mongoose.Types.ObjectId.isValid(userId);
  if(!isValid) return res.status(400).json('user : id is invalid');

  const pipeline = [
    { $match: { authorId: new mongoose.Types.ObjectId(userId) } },
    {
      $lookup: {
        from: "reactions",
        localField: "_id",
        foreignField: "storyId",
        as: "reactions",
      },
    },
  ];

  try {
    const storiesWithReactions = await Story.aggregate(pipeline);
    return res.status(200).json(storiesWithReactions);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

module.exports = reactionsRecieved;
