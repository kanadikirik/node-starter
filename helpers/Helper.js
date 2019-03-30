const ErrorHelper = require('./ErrorHelper'),
      InputValidationHelper = require('./InputValidationHelper'),
      TokenHelper = require('./TokenHelper'),
      UserHelper = require('./UserHelper');

module.exports = {
  error: ErrorHelper,
  input: InputValidationHelper,
  token: TokenHelper,
  user: UserHelper,
}