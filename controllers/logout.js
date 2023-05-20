const User = require("../model/User");
const handleLogout = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) {
    res.sendStatus(204);
    return;
  }
  const refreshToken = cookies.jwt.split(" ")[1];
  try {
    const foundUser = await User.findOne({ refreshToken }).exec();
    if (!foundUser) {
      res.clearCookie("jwt", refreshToken, {
        httpOnly: true,
        secure: process.env.ENVIRONMENT === "dev" ? false : true,
        maxAge: 24 * 60 * 60 * 1000,
      });
      res.sendStatus(204);
      return;
    }

    foundUser.refreshToken = "";
    await foundUser.save();

    res.clearCookie("jwt", refreshToken, {
      httpOnly: true,
      secure: process.env.ENVIRONMENT === "dev" ? false : true,
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.sendStatus(204); // no content to send back
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = handleLogout;
