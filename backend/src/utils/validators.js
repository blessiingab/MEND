const validator = require('validator');

const validateEmail = (email) => {
  return validator.isEmail(email);
};

const validatePassword = (password) => {
  // Minimum 8 characters, 1 uppercase, 1 lowercase, 1 number
  const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
  return strongRegex.test(password);
};

const validateRequired = (value) => {
  return value !== null && value !== undefined && value.toString().trim() !== '';
};

const validateIntRange = (value, min, max) => {
  const num = parseInt(value);
  return Number.isInteger(num) && num >= min && num <= max;
};

const validateDateFormat = (date) => {
  return validator.isISO8601(date);
};

const validateUrl = (url) => {
  return validator.isURL(url);
};

module.exports = {
  validateEmail,
  validatePassword,
  validateRequired,
  validateIntRange,
  validateDateFormat,
  validateUrl
};
