const requestBodySchema = require("../model/RequestBodySchema/createStory");
const Story = require("../model/Story");
const createNewStory = async (req, res) => {
  const { error, value } = requestBodySchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  value.authorId = req.user.id;

  try {
    //create new story
    const newStory = await Story.create(value);
    return res.status(201).json("story : successfully created");
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = createNewStory;
