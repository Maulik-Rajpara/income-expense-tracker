/**
 * Enhanced Standardized API Response Formatter
 * Ensures consistent response structure across all endpoints
 * Includes metadata, pagination, and request tracking
 */
class ResponseFormatter {
  /**
   * Success response with enhanced metadata
   */
  static success(res, message, data = null, statusCode = 200, meta = {}) {
    const response = {
      success: true,
      message,
      data,
      meta: {
        timestamp: new Date().toISOString(),
        requestId: res.locals.requestId || null,
        ...meta
      }
    };

    return res.status(statusCode).json(response);
  }

  /**
   * Created response (201)
   */
  static created(res, message, data = null, meta = {}) {
    return this.success(res, message, data, 201, meta);
  }

  /**
   * Success response with pagination
   */
  static successWithPagination(res, message, data, pagination, meta = {}) {
    const response = {
      success: true,
      message,
      data,
      pagination: {
        page: pagination.page,
        limit: pagination.limit,
        total: pagination.total,
        totalPages: pagination.totalPages,
        hasNext: pagination.hasNext,
        hasPrev: pagination.hasPrev
      },
      meta: {
        timestamp: new Date().toISOString(),
        requestId: res.locals.requestId || null,
        ...meta
      }
    };

    return res.status(200).json(response);
  }

  /**
   * No Content response (204)
   */
  static noContent(res) {
    return res.status(204).send();
  }

  /**
   * Error response (should use error handler instead, but kept for backward compatibility)
   */
  static error(res, message, data = null, statusCode = 400) {
    return res.status(statusCode).json({
      success: false,
      error: {
        code: 'ERROR',
        message,
        ...(data && { details: data })
      },
      meta: {
        timestamp: new Date().toISOString(),
        requestId: res.locals.requestId || null
      }
    });
  }

  /**
   * Not Found response
   */
  static notFound(res, message = 'Resource not found') {
    return this.error(res, message, null, 404);
  }
}

export default ResponseFormatter;

