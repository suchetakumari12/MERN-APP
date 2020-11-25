const Validator = require("validator");
const isEmpty = require("is-empty");

module.exports = function validateLoginInput(data) {
  let errors = {};

  // Convert empty fields to an empty string so we can use validator functions
  data.firstname = !isEmpty(data.firstname) ? data.firstname : "";
  data.lastname = !isEmpty(data.lastname) ? data.lastname : "";
  data.ssn = !isEmpty(data.ssn) ? data.ssn : "";

  // Ssn checks
  if (Validator.isEmpty(data.ssn)) {
    errors.ssn = "SSN field is required";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
