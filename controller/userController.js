const { StatusCodes } = require("http-status-codes");

const home = async (req, res) => {
  const { username } = req.user;

  res.status(StatusCodes.OK).json({ username: username });
};

const logout = async (req, res) => {
  res.send("logout route");
};

module.exports = { home, logout };
