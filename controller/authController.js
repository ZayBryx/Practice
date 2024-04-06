const { StatusCodes } = require("http-status-codes");
const Account = require("../models/Account");
const { registerValidator } = require("../validators");
const { BadRequestError, NotFoundError } = require("../Errors");
const jwt = require("jsonwebtoken");

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

  const { username, email, password, confirmPassword } = value;

  const account = await Account.create({ username, email, password });

  res.status(StatusCodes.CREATED).json(account);
};

const refresh = async (req, res) => {
  const { refresh_token } = req.cookies;

  if (!refresh_token) {
    throw new BadRequestError("Invalid Token");
  }

  const payload = jwt.verify(refresh_token, process.env.JWT_SECRET);

  if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
    throw new UnauthenticatedError("Token is expired");
  }

  const { userId } = payload;
  if (!userId) {
    throw new BadRequestError("Invalid Token");
  }

  const account = await Account.findOne({ _id: userId });
  const accessToken = account.generateAccessToken();

  res.status(StatusCodes.OK).json({ token: accessToken });
};

module.exports = { login, register, refresh };
