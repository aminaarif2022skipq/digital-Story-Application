const jwt = require("jsonwebtoken");

const verifyJWT = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res.sendStatus(401);
    return;
  }

  const accessToken = authHeader.split(" ")[1];

  jwt.verify(
    accessToken,
    process.env.ACCESS_TOKEN_SECRET_KEY,
    (err, decoded) => {
      if (err) {
        return res.sendStatus(403);
      }
      req.user = decoded;
      next();
    }
  );
};

module.exports = verifyJWT;
