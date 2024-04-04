const jwt = require("jsonwebtoken");
const { UnathenticatedError } = require("../Errors");

const auth = async (req, res, next) => {
  const accessToken = req.headers["authorization"];

  if (!accessToken || !accessToken.startsWith("Bearer")) {
    throw new UnathenticatedError("Authentication Invalid");
  }

  const token = accessToken.split(" ")[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    req.user = {
      userId: payload.userId,
      username: payload.username,
      role: payload.role,
    };
    next();
  } catch (error) {
    throw new UnathenticatedError("Authentication Invalid");
  }
};

module.exports = auth;
