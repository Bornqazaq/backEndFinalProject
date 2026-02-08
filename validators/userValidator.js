const Joi = require("joi");

const updateProfileSchema = Joi.object({
  username: Joi.string()
    .min(3)
    .max(30)
    .trim()
    .optional()
    .messages({
      "string.min": "Username must be at least 3 characters",
      "string.max": "Username must not exceed 30 characters"
    }),
  
  email: Joi.string()
    .email()
    .lowercase()
    .trim()
    .optional()
    .messages({
      "string.email": "Please enter a valid email address"
    })
});

const updateRoleSchema = Joi.object({
  userId: Joi.string()
    .required()
    .messages({
      "any.required": "User ID is required"
    }),
  
  role: Joi.string()
    .valid("user", "admin", "moderator", "premium")
    .required()
    .messages({
      "any.only": "Invalid role. Must be one of: user, admin, moderator, premium",
      "any.required": "Role is required"
    })
});

module.exports = {
  updateProfileSchema,
  updateRoleSchema
};
