const { StatusCodes } = require("http-status-codes");
const CustomError = require("../Errors/custom-error");
const Account = require("../models/Account");
const { registerValidator } = require("../validators");
const EXPIRES = 1 * 60 * 60 * 1000; // 8 hours

const login = async (req, res) => {
  const { username, password } = req.body;

  const account = await Account.findOne({
    $or: [{ username: username }, { email: username }],
  });

  if (!account) {
    throw new CustomError("User not found", StatusCodes.NOT_FOUND);
  }

  const isMatch = await account.isPasswordCorrect(password);

  if (!isMatch) {
    throw new CustomError("password is incorrect");
  }
  const accessToken = account.generateAccessToken();
  const refreshToken = account.generateRefreshToken();

  res
    .status(StatusCodes.OK)
    .cookie("refresh_token", refreshToken, {
      httpOnly: true,
      secure: process.env.SECURE,
      maxAge: EXPIRES,
    })
    .json({ username: account.username, accessToken: accessToken });
};

const register = async (req, res) => {
  const { value, error } = registerValidator.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    throw new CustomError(error.message, StatusCodes.BAD_REQUEST);
  }

  const { username, email, password, repeat_password } = value;

  const account = await Account.create({ username, email, password });

  res.status(StatusCodes.CREATED).json(account);
};

module.exports = { login, register };
