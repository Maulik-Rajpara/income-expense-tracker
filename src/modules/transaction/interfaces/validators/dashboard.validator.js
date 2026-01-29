import Joi from 'joi';

// Dashboard query params: date range only (user from token)
const dashboardQuerySchema = Joi.object({
  startDate: Joi.date().optional().messages({
    'date.base': 'Start date must be a valid date (e.g. YYYY-MM-DD)'
  }),
  endDate: Joi.date().optional().messages({
    'date.base': 'End date must be a valid date (e.g. YYYY-MM-DD)'
  })
}).custom((value, helpers) => {
  if (value.startDate && value.endDate) {
    const start = new Date(value.startDate);
    const end = new Date(value.endDate);
    if (end < start) {
      return helpers.error('any.custom', { message: 'End date must be after start date' });
    }
  }
  return value;
});

const validate = (schema, source = 'query') => {
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

     if (source === 'query') {
      req.validatedQuery = value;
    } else {
      req[source] = value;
    }
    next();
  };
};

export const validateDashboardQuery = validate(dashboardQuerySchema, 'query');
