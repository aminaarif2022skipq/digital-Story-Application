const Reaction = require("../model/Reaction");
const mongoose = require("mongoose");

const getUserReactions = async (req, res) => {
  //get the reactions made by the user
  const pipeline = [
    { $match: { userId: new mongoose.Types.ObjectId(req.user.id) } },
    //get unique story id's
    {
      $group: {
        _id: null,
        uniqueStoryIds: {
          $addToSet: "$storyId",
        },
      },
    },
    // perform the join with Story coll to get the stories
    {
      $lookup: {
        from: "stories",
        localField: "uniqueStoryIds",
        foreignField: "_id",
        as: "stories",
      },
    },
  ];
  try {
    const userReactions = await Reaction.aggregate(pipeline);
    const publicStories = userReactions[0].stories.filter(
      (story) => story.status === "public"
    );
    return res.status(200).json(publicStories);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

module.exports = getUserReactions;
