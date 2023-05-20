const requestBodySchema = require("../model/RequestBodySchema/getAllStories");
const mongoose = require('mongoose');
const Story = require("../model/Story");
const getAllStories = async (req, res) => {
  const { error, value } = requestBodySchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

    const pipeline = [
     // fetch all stories of the user
      { $match: { authorId: new mongoose.Types.ObjectId(req.user.id) } },
    ];
     //sort the documents
    if(value.sort) pipeline.push({ $sort : value.fields});
  try {
    const result = await Story.aggregate(pipeline);
    return res.status(200).json(result);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

};
module.exports = getAllStories;
