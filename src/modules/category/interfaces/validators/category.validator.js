import Joi from 'joi';
import { CATEGORY_TYPES } from '../../infrastructure/database/models/category.model.js';

// Create Category Schema
const createCategorySchema = Joi.object({
  name: Joi.string()
    .trim()
    .min(2)
    .max(100)
    .required()
    .messages({
      'string.min': 'Category name must be at least 2 characters long',
      'string.max': 'Category name must be at most 100 characters long',
      'any.required': 'Category name is required'
    }),
  type: Joi.string()
    .valid(CATEGORY_TYPES.INCOME, CATEGORY_TYPES.EXPENSE)
    .required()
    .messages({
      'any.only': 'Category type must be either "income" or "expense"',
      'any.required': 'Category type is required'
    })
});

// Update Category Schema
const updateCategorySchema = Joi.object({
  name: Joi.string()
    .trim()
    .min(2)
    .max(100)
    .optional()
    .messages({
      'string.min': 'Category name must be at least 2 characters long',
      'string.max': 'Category name must be at most 100 characters long'
    }),
  type: Joi.string()
    .valid(CATEGORY_TYPES.INCOME, CATEGORY_TYPES.EXPENSE)
    .optional()
    .messages({
      'any.only': 'Category type must be either "income" or "expense"'
    })
}).min(1).messages({
  'object.min': 'At least one field must be provided for update'
});

// Category ID Schema
const categoryIdSchema = Joi.object({
  id: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      'string.pattern.base': 'Invalid category ID format',
      'any.required': 'Category ID is required'
    })
});

// Query Params Schema
const queryParamsSchema = Joi.object({
  page: Joi.number().integer().min(1).optional(),
  limit: Joi.number().integer().min(1).max(100).optional(),
  sort: Joi.string().valid('createdAt', 'name', 'type').optional(),
  order: Joi.string().valid('asc', 'desc').optional(),
  search: Joi.string().trim().max(100).optional(),
  type: Joi.string().valid(CATEGORY_TYPES.INCOME, CATEGORY_TYPES.EXPENSE).optional()
});

// Type Param Schema (for /categories/:type routes)
const typeParamSchema = Joi.object({
  type: Joi.string()
    .valid(CATEGORY_TYPES.INCOME, CATEGORY_TYPES.EXPENSE)
    .required()
    .messages({
      'any.only': 'Category type must be either "income" or "expense"',
      'any.required': 'Category type is required'
    })
});

// ==================== VALIDATION MIDDLEWARE ====================

const validate = (schema, source = 'body') => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[source], {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const details = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));

      return res.status(422).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Validation failed',
          details
        },
        meta: {
          timestamp: new Date().toISOString(),
          requestId: res.locals.requestId || null,
          path: req.originalUrl
        }
      });
    }

    // ✅ SAFE HANDLING
    if (source === 'query') {
      req.validatedQuery = value;
    } else {
      req[source] = value;
    }
    next();
  };
};

// ==================== EXPORTS ====================

export const validateCreateCategory = validate(createCategorySchema, 'body');
export const validateUpdateCategory = validate(updateCategorySchema, 'body');
export const validateCategoryId = validate(categoryIdSchema, 'params');
export const validateCategoryQueryParams = validate(queryParamsSchema, 'query');
export const validateCategoryType = validate(typeParamSchema, 'params');
