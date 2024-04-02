const Joi = require("joi");

const registerSchema = Joi.object({
  username: Joi.string().min(3).max(30).required().messages({
    "string.min": "Username must be at least 3 characters long",
    "any.required": "Username is required",
    "string.max": "Username must not exceed to 30 chracters long",
  }),
  email: Joi.string().email().required().messages({
    "string.email": "Invalid email address",
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
  repeat_password: Joi.valid(Joi.ref("password")).required().messages({
    "any.only": "Repeat password must match the password",
    "any.required": "Repeat password is required",
  }),
});

module.exports = registerSchema;
