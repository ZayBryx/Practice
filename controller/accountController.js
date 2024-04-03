const { StatusCodes } = require("http-status-codes");
const Account = require("../models/Account");
const { registerValidator } = require("../validators");
const { BadRequestError, NotFoundError } = require("../Errors");

const EXPIRES = 1 * 60 * 60 * 1000; // 8 hours

const login = async (req, res) => {
  const { username, password } = req.body;

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
    .cookie("token", refreshToken, {
      httpOnly: true,
      secure: process.env.SECURE,
      maxAge: EXPIRES,
    })
    .cookie("Bearer ", `Bearer ${accessToken}`, {
      httpOnly: true,
      secure: process.env.SECURE,
      maxAge: 15 * 60 * 1000, // 15mins
    })
    .json({ username: account.username, accessToken: accessToken });
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
