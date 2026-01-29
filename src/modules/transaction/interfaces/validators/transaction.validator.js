import Joi from 'joi';
import { CATEGORY_TYPES } from '../../../category/infrastructure/database/models/category.model.js';

// Create Transaction Schema
const createTransactionSchema = Joi.object({
  type: Joi.string()
    .valid(CATEGORY_TYPES.INCOME, CATEGORY_TYPES.EXPENSE)
    .required()
    .messages({
      'any.only': 'Transaction type must be either "income" or "expense"',
      'any.required': 'Transaction type is required'
    }),
  categoryId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      'string.pattern.base': 'Invalid category ID format',
      'any.required': 'Category is required'
    }),
  amount: Joi.number()
    .positive()
    .min(0.01)
    .required()
    .messages({
      'number.base': 'Amount must be a number',
      'number.positive': 'Amount must be greater than 0',
      'number.min': 'Amount must be at least 0.01',
      'any.required': 'Amount is required'
    }),
  date: Joi.date()
    .required()
    .messages({
      'date.base': 'Date must be a valid date',
      'any.required': 'Transaction date is required'
    }),
  notes: Joi.string()
    .trim()
    .max(500)
    .allow('')
    .optional()
    .messages({
      'string.max': 'Notes cannot exceed 500 characters'
    })
});

// Update Transaction Schema
const updateTransactionSchema = Joi.object({
  type: Joi.string()
    .valid(CATEGORY_TYPES.INCOME, CATEGORY_TYPES.EXPENSE)
    .optional()
    .messages({
      'any.only': 'Transaction type must be either "income" or "expense"'
    }),
  categoryId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .optional()
    .messages({
      'string.pattern.base': 'Invalid category ID format'
    }),
  amount: Joi.number()
    .positive()
    .min(0.01)
    .optional()
    .messages({
      'number.base': 'Amount must be a number',
      'number.positive': 'Amount must be greater than 0',
      'number.min': 'Amount must be at least 0.01'
    }),
  date: Joi.date()
    .optional()
    .messages({
      'date.base': 'Date must be a valid date'
    }),
  notes: Joi.string()
    .trim()
    .max(500)
    .allow('')
    .optional()
    .messages({
      'string.max': 'Notes cannot exceed 500 characters'
    })
}).min(1).messages({
  'object.min': 'At least one field must be provided for update'
});

// Transaction ID Schema
const transactionIdSchema = Joi.object({
  id: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      'string.pattern.base': 'Invalid transaction ID format',
      'any.required': 'Transaction ID is required'
    })
});

// Query Params Schema (for filtering)
const queryParamsSchema = Joi.object({
  page: Joi.number().integer().min(1).optional(),
  limit: Joi.number().integer().min(1).max(100).optional(),
  sort: Joi.string().valid('date', 'amount', 'createdAt', 'updatedAt').optional(),
  order: Joi.string().valid('asc', 'desc').optional(),
  search: Joi.string().trim().max(500).optional(), // Search in notes
  categoryId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).optional(),
  type: Joi.string().valid(CATEGORY_TYPES.INCOME, CATEGORY_TYPES.EXPENSE).optional(),
  userId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).optional(), // For admin only
  startDate: Joi.date().optional().messages({
    'date.base': 'Start date must be a valid date'
  }),
  endDate: Joi.date().optional().messages({
    'date.base': 'End date must be a valid date'
  })
}).custom((value, helpers) => {
  // Validate date range: endDate should be after startDate
  if (value.startDate && value.endDate) {
    const start = new Date(value.startDate);
    const end = new Date(value.endDate);
    if (end < start) {
      return helpers.error('any.custom', {
        message: 'End date must be after start date'
      });
    }
  }
  return value;
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

    // Replace req[source] with validated and sanitized value
    if (source === 'query') {
      req.validatedQuery = value;
    } else {
      req[source] = value;
    }
    next();
  };
};

// ==================== EXPORTS ====================

export const validateCreateTransaction = validate(createTransactionSchema, 'body');
export const validateUpdateTransaction = validate(updateTransactionSchema, 'body');
export const validateTransactionId = validate(transactionIdSchema, 'params');
export const validateTransactionQueryParams = validate(queryParamsSchema, 'query');
