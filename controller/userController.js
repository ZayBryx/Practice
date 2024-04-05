const { StatusCodes } = require("http-status-codes");
const BlackListToken = require("../models/BlackListToken");
const { BadRequestError } = require("../Errors");

const home = async (req, res) => {
  const { username } = req.user;

  res.status(StatusCodes.OK).json({ username: username });
};

const logout = async (req, res) => {
  const authorization = req.headers.authorization;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    throw new BadRequestError("Invalid Token");
  }

  const token = authorization.split(" ")[1];

  await BlackListToken.create({ token });
  delete req.user;

  res.status(StatusCodes.OK).json({ messsage: "Token revoked successfully" });
};

module.exports = { home, logout };
