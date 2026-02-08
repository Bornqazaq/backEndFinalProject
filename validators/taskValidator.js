const Joi = require("joi");

const createTaskSchema = Joi.object({
  title: Joi.string()
    .min(1)
    .max(200)
    .required()
    .messages({
      "string.empty": "Title is required",
      "string.max": "Title must not exceed 200 characters",
      "any.required": "Title is required"
    }),
  
  description: Joi.string()
    .max(1000)
    .allow("", null)
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
}).options({ stripUnknown: true });

const updateTaskSchema = Joi.object({
  title: Joi.string()
    .min(1)
    .max(200)
    .optional()
    .messages({
      "string.max": "Title must not exceed 200 characters"
    }),
  
  description: Joi.string()
    .max(1000)
    .allow("", null)
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
}).options({ stripUnknown: true });

module.exports = {
  createTaskSchema,
  updateTaskSchema
};
