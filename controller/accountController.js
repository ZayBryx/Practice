const { StatusCodes } = require("http-status-codes");
const BlackListToken = require("../models/BlackListToken");
const { BadRequestError } = require("../Errors");

const home = async (req, res) => {
  const { username } = req.user;

  if (!username) {
    throw new BadRequestError("username does not exist");
  }

  res.status(StatusCodes.OK).json({ username: username });
};

const logout = async (req, res) => {
  const authorization = req.headers.authorization;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    throw new BadRequestError("Invalid Token");
  }

  const token = authorization.split(" ")[1];

  await BlackListToken.create({ token, token_type: "access" });
  delete req.user;

  res.clearCookie("refresh_token", { path: "/api/auth/refresh" });
  res.status(StatusCodes.OK).json({ messsage: "Token revoked successfully" });
};

module.exports = { home, logout };
