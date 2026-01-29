import Joi from 'joi';

// ==================== VALIDATION SCHEMAS ====================

// Password validation pattern (at least 1 uppercase, 1 lowercase, 1 number)
const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;

// Register Schema
const registerSchema = Joi.object({
  firstName: Joi.string()
    .trim()
    .min(2)
    .max(50)
    .required()
    .messages({
      'string.min': 'First name must be at least 2 characters long',
      'string.max': 'First name must be at most 50 characters long',
      'any.required': 'First name is required'
    }),
  lastName: Joi.string()
    .trim()
    .min(2)
    .max(50)
    .required()
    .messages({
      'string.min': 'Last name must be at least 2 characters long',
      'string.max': 'Last name must be at most 50 characters long',
      'any.required': 'Last name is required'
    }),
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'Please provide a valid email address',
      'any.required': 'Email is required'
    }),
  phoneNumber: Joi.string()
    .pattern(/^[0-9]{10,15}$/)
    .optional()
    .allow('')
    .messages({
      'string.pattern.base': 'Phone number must be between 10 to 15 digits'
    }),
  password: Joi.string()
    .min(8)
    .max(100)
    .pattern(passwordPattern)
    .required()
    .messages({
      'string.min': 'Password must be at least 8 characters long',
      'string.max': 'Password must be at most 100 characters long',
      'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, and one number',
      'any.required': 'Password is required'
    }),
  confirmPassword: Joi.string()
    .valid(Joi.ref('password'))
    .required()
    .messages({
      'any.only': 'Passwords do not match',
      'any.required': 'Confirm password is required'
    })
});

// Login Schema
const loginSchema = Joi.object({
  identifier: Joi.string()
    .required()
    .messages({
      'any.required': 'Email or phone number is required'
    }),
  password: Joi.string()
    .required()
    .messages({
      'any.required': 'Password is required'
    })
});

// Change Password Schema
const changePasswordSchema = Joi.object({
  currentPassword: Joi.string()
    .required()
    .messages({
      'any.required': 'Current password is required'
    }),
  newPassword: Joi.string()
    .min(8)
    .max(100)
    .pattern(passwordPattern)
    .required()
    .messages({
      'string.min': 'New password must be at least 8 characters long',
      'string.max': 'New password must be at most 100 characters long',
      'string.pattern.base': 'New password must contain at least one uppercase letter, one lowercase letter, and one number',
      'any.required': 'New password is required'
    }),
  confirmNewPassword: Joi.string()
    .valid(Joi.ref('newPassword'))
    .required()
    .messages({
      'any.only': 'Passwords do not match',
      'any.required': 'Confirm new password is required'
    })
});

// Forgot Password Schema
const forgotPasswordSchema = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'Please provide a valid email address',
      'any.required': 'Email is required'
    })
});

// Reset Password Schema
const resetPasswordSchema = Joi.object({
  token: Joi.string()
    .required()
    .messages({
      'any.required': 'Reset token is required'
    }),
  newPassword: Joi.string()
    .min(8)
    .max(100)
    .pattern(passwordPattern)
    .required()
    .messages({
      'string.min': 'Password must be at least 8 characters long',
      'string.max': 'Password must be at most 100 characters long',
      'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, and one number',
      'any.required': 'New password is required'
    }),
  confirmPassword: Joi.string()
    .valid(Joi.ref('newPassword'))
    .required()
    .messages({
      'any.only': 'Passwords do not match',
      'any.required': 'Confirm password is required'
    })
});

// Refresh Token Schema
const refreshTokenSchema = Joi.object({
  refreshToken: Joi.string()
    .required()
    .messages({
      'any.required': 'Refresh token is required'
    })
});

// Update Profile Schema (for user updating their own profile)
const updateProfileSchema = Joi.object({
  firstName: Joi.string()
    .trim()
    .min(2)
    .max(50)
    .optional()
    .messages({
      'string.min': 'First name must be at least 2 characters long',
      'string.max': 'First name must be at most 50 characters long'
    }),
  lastName: Joi.string()
    .trim()
    .min(2)
    .max(50)
    .optional()
    .messages({
      'string.min': 'Last name must be at least 2 characters long',
      'string.max': 'Last name must be at most 50 characters long'
    }),
  phoneNumber: Joi.string()
    .pattern(/^[0-9]{10,15}$/)
    .optional()
    .allow('')
    .messages({
      'string.pattern.base': 'Phone number must be between 10 to 15 digits'
    })
}).min(1).messages({
  'object.min': 'At least one field must be provided for update'
});

// Update User Schema (for admin updating any user)
const updateUserSchema = Joi.object({
  firstName: Joi.string()
    .trim()
    .min(2)
    .max(50)
    .optional()
    .messages({
      'string.min': 'First name must be at least 2 characters long',
      'string.max': 'First name must be at most 50 characters long'
    }),
  lastName: Joi.string()
    .trim()
    .min(2)
    .max(50)
    .optional()
    .messages({
      'string.min': 'Last name must be at least 2 characters long',
      'string.max': 'Last name must be at most 50 characters long'
    }),
  email: Joi.string()
    .email()
    .optional()
    .messages({
      'string.email': 'Please provide a valid email address'
    }),
  phoneNumber: Joi.string()
    .pattern(/^[0-9]{10,15}$/)
    .optional()
    .allow('')
    .messages({
      'string.pattern.base': 'Phone number must be between 10 to 15 digits'
    }),
  isActive: Joi.boolean()
    .optional()
}).min(1).messages({
  'object.min': 'At least one field must be provided for update'
});

// User ID Schema
const userIdSchema = Joi.object({
  id: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      'string.pattern.base': 'Invalid user ID format',
      'any.required': 'User ID is required'
    })
});

// Query Params Schema
const queryParamsSchema = Joi.object({
  page: Joi.number().integer().min(1).optional(),
  limit: Joi.number().integer().min(1).max(100).optional(),
  sort: Joi.string().valid('createdAt', 'firstName', 'lastName', 'email').optional(),
  order: Joi.string().valid('asc', 'desc').optional(),
  search: Joi.string().trim().max(100).optional()
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
    req[source] = value;
    next();
  };
};

// ==================== EXPORTS ====================

// Auth validators
export const validateRegister = validate(registerSchema, 'body');
export const validateLogin = validate(loginSchema, 'body');
export const validateChangePassword = validate(changePasswordSchema, 'body');
export const validateForgotPassword = validate(forgotPasswordSchema, 'body');
export const validateResetPassword = validate(resetPasswordSchema, 'body');
export const validateRefreshToken = validate(refreshTokenSchema, 'body');

// Profile validators
export const validateUpdateProfile = validate(updateProfileSchema, 'body');

// Admin validators
export const validateUpdateUser = validate(updateUserSchema, 'body');
export const validateUserId = validate(userIdSchema, 'params');
export const validateUserQueryParams = validate(queryParamsSchema, 'query');
