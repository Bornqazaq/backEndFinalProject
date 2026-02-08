const Joi = require("joi");

const createTaskSchema = Joi.object({
  title: Joi.string()
    .min(1)
    .max(200)
    .trim()
    .required()
    .messages({
      "string.empty": "Title is required",
      "string.max": "Title must not exceed 200 characters",
      "any.required": "Title is required"
    }),
  
  description: Joi.string()
    .max(1000)
    .trim()
    .allow("")
    .optional()
    .messages({
      "string.max": "Description must not exceed 1000 characters"
    }),
  
  dueDate: Joi.date()
    .optional()
    .allow(null, "")
    .messages({
      "date.base": "Please enter a valid date"
    }),
  
  status: Joi.boolean()
    .optional()
});

const updateTaskSchema = Joi.object({
  title: Joi.string()
    .min(1)
    .max(200)
    .trim()
    .optional()
    .messages({
      "string.max": "Title must not exceed 200 characters"
    }),
  
  description: Joi.string()
    .max(1000)
    .trim()
    .allow("")
    .optional()
    .messages({
      "string.max": "Description must not exceed 1000 characters"
    }),
  
  dueDate: Joi.date()
    .optional()
    .allow(null, "")
    .messages({
      "date.base": "Please enter a valid date"
    }),
  
  status: Joi.boolean()
    .optional()
});

module.exports = {
  createTaskSchema,
  updateTaskSchema
};
