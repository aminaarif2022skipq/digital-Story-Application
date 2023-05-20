const User = require("../model/User");
const jwt = require("jsonwebtoken");

const handleRefreshToken = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) {
    res.sendStatus(401);
    return;
  }

  const refreshToken = cookies.jwt;

  try {
    const foundOne = await User.findOne({ refreshToken }).exec();
    if (!foundOne) {
      return res.sendStatus(403); //forbidden
    }
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET_KEY,
      (err, decoded) => {
        if (err || decoded.username !== foundOne.username) {
          res.sendStatus(403);
          return;
        }

        const accessKey = jwt.sign(
          { username: foundOne.username, id: foundOne["_id"] },
          process.env.ACCESS_TOKEN_SECRET_KEY,
          { expiresIn: "30s" }
        );
        res.json({ accessKey });
      }
    );
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = handleRefreshToken;
