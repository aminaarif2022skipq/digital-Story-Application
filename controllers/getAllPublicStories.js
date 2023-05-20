const requestBodySchema = require("../model/RequestBodySchema/getAllStories");
const Story = require("../model/Story");
const getAllStories = async (req, res) => {
  const { error, value } = requestBodySchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const pipeline = [
    // fetch all public stories
    { $match: { status: "public" } },
  ];
  //sort the documents
  if(value.sort) pipeline.push({ $sort : value.fields});
  console.log(pipeline);
  try {
    const result = await Story.aggregate(pipeline);
    return res.status(200).json(result);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

};
module.exports = getAllStories;
