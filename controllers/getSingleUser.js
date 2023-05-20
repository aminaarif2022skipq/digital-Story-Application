const User = require("../model/User");
const getSingleUser = async (req, res) => {
  const id = req.params.id;

  try {
    const foundUser = await User.findById(id, {
      refreshToken: 0,
      createdAt: 0,
      updatedAt: 0,
      password : 0,
      __v: 0,
    }).exec();
    if (!foundUser) return res.sendStatus(404);

    res.status(200).json(foundUser);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = getSingleUser;
