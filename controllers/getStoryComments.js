const mongoose = require("mongoose");
const Comment = require("../model/Comment");
const Story = require("../model/Story");
const getStoryComments = async (req, res) => {
  const storyId = req.params.id;
  const isValid = mongoose.Types.ObjectId.isValid(storyId);
  if (!isValid) return res.status(400).json({ message: "story id invalid" });

  const foundStory = await Story.findById(id);
    if (!foundStory) return res.sendStatus(404);

  if(foundStory.authorId.toString() !== req.user.id && foundStory.status === 'private')
  return res.status(403).json({ message: "this story is private" });

  const pipeline = [
    { $match: { storyId: new mongoose.Types.ObjectId(storyId) } },
    { $sort: { order: 1 } },
  ];

  try {
    const foundComments = await Comment.aggregate(pipeline);
    if (foundComments.length > 0) return res.status(200).json(foundComments);
    else return res.status(404).json([]);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

module.exports = getStoryComments;
