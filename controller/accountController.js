const Joi = require("joi");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../Errors/custom-error");
const Account = require("../models/Account");

const registerSchema = Joi.object({
  username: Joi.string().min(3).max(30).required().messages({
    "string.min": "Username must be at least 3 characters long",
    "any.required": "Username is required",
    "string.max": "Username must not exceed to 30 chracters long",
  }),
  email: Joi.string().email().required().messages({
    "string.email": "Please fill a valid email address",
    "any.required": "Email is requried",
  }),
  password: Joi.string()
    .pattern(
      new RegExp(
        "^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()\\-_=+{};:,<.>ยง?|]).{8,}$"
      )
    )
    .required()
    .messages({
      "string.pattern.base":
        "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one digit, and one special character",
      "any.required": "Password is required",
    }),
});

const login = async (req, res) => {
  res.send("login route");
};

const register = async (req, res) => {
  const { value, error } = registerSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    throw new CustomError(error.message, StatusCodes.BAD_REQUEST);
  }

  const { username, email, password } = value;
  const account = await Account.create({ username, email, password });
  res.status(StatusCodes.CREATED).json(account);
};

module.exports = { login, register };
