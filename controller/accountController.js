const { StatusCodes } = require("http-status-codes");
const Account = require("../models/Account");
const { registerValidator } = require("../validators");
const { BadRequestError, NotFoundError } = require("../Errors");

const millisecondsIn7Days = 7 * 24 * 60 * 60 * 1000;

const login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    throw new NotFoundError("Username and Password is required");
  }

  const account = await Account.findOne({
    $or: [{ username: username }, { email: username }],
  });

  if (!account) {
    throw new NotFoundError("User not found");
  }

  const isMatch = await account.isPasswordCorrect(password);

  if (!isMatch) {
    throw new BadRequestError("password is incorrect");
  }
  const accessToken = account.generateAccessToken();
  const refreshToken = account.generateRefreshToken();

  res
    .status(StatusCodes.OK)
    .cookie("refresh_token", refreshToken, {
      httpOnly: true,
      secure: process.env.SECURE,
      maxAge: millisecondsIn7Days,
    })
    .json({ username: account.username, token: accessToken });
};

const register = async (req, res) => {
  const { value, error } = registerValidator.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    throw new BadRequestError(error.message);
  }

  const { username, email, password, repeat_password } = value;

  const account = await Account.create({ username, email, password });

  res.status(StatusCodes.CREATED).json(account);
};

module.exports = { login, register };
