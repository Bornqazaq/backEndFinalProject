const Joi = require("joi");

const registerSchema = Joi.object({
  username: Joi.string()
    .min(3)
    .max(30)
    .required()
    .messages({
      "string.min": "Username must be at least 3 characters",
      "string.max": "Username must not exceed 30 characters",
      "string.empty": "Username is required",
      "any.required": "Username is required"
    }),
  
  email: Joi.string()
    .email()
    .required()
    .messages({
      "string.email": "Please enter a valid email address",
      "string.empty": "Email is required",
      "any.required": "Email is required"
    }),
  
  password: Joi.string()
    .min(6)
    .max(50)
    .required()
    .messages({
      "string.min": "Password must be at least 6 characters",
      "string.max": "Password must not exceed 50 characters",
      "string.empty": "Password is required",
      "any.required": "Password is required"
    })
}).options({ stripUnknown: true });

const loginSchema = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .messages({
      "string.email": "Please enter a valid email address",
      "string.empty": "Email is required",
      "any.required": "Email is required"
    }),
  
  password: Joi.string()
    .min(6)
    .required()
    .messages({
      "string.min": "Password must be at least 6 characters",
      "string.empty": "Password is required",
      "any.required": "Password is required"
    })
}).options({ stripUnknown: true });

module.exports = {
  registerSchema,
  loginSchema
};
