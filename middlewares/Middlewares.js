const ErrorMiddlewares = require('./ErrorMiddlewares'),
      ValidationMiddlewares = require('./ValidationMiddlewares'),
      VerificationMiddlewares = require('./VerificationMiddlewares');
      RateLimitationMiddlewares = require('./RateLimitationMiddlewares');

module.exports = {
  error: ErrorMiddlewares,
  validation: ValidationMiddlewares,
  verification: VerificationMiddlewares,
  limit: RateLimitationMiddlewares,
}