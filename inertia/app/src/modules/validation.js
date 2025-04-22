import { heliosLogger } from "./logging";

class ValidationResponse {
  constructor(isValid, errorMsg = '') {
    this.isValid = isValid;
    this.errorMsg = errorMsg;
  }

  valueOf() {
    return Boolean(this.isValid);
  }

  toString() {
    return this.errorMsg;
  }

  static valid() {
    return new ValidationResponse(true);
  }

  static invalid(errorMsg, details = '') {
    heliosLogger(errorMsg, details);
    return new ValidationResponse(false, errorMsg + details);
  }

  static testValidity(value, errorMsg = '') {
    return value ? ValidationResponse.valid() : ValidationResponse.invalid(errorMsg);
  }
}

export const MIN_INPUT_LENGTH = 2;
export const MAX_INPUT_LENGTH = 200;

export const ALL_FIELDS_REQUIRED = "All fields are required";
export const FIELD_REQUIRED = "This field is required";
export const FIELD_MUST_BE_NUMBER = "This field must be a number";
export const FIELD_MUST_BE_BETWEEN = `This field must be between ${MIN_INPUT_LENGTH} and ${MAX_INPUT_LENGTH} characters`;
export const OPTION_NOT_VALID = "This option is not valid";

export const deepEqual = (obj1, obj2) => {
  if (obj1 === obj2) return true;
  if (obj1 == null || obj2 == null) return false;
  if (typeof obj1 !== 'object' || typeof obj2 !== 'object') return false;

  let keys1 = Object.keys(obj1);
  let keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) return false;

  for (let key of keys1) {
    if (!keys2.includes(key) || !deepEqual(obj1[key], obj2[key])) return false;
  }

  return true;
};

export const validateTextInput = (input, name = '') => {
  if (!input) {
    return ValidationResponse.invalid(FIELD_REQUIRED, name);
  } else if (input.length < MIN_INPUT_LENGTH || input.length > MAX_INPUT_LENGTH) {
    return ValidationResponse.invalid(FIELD_MUST_BE_BETWEEN, name);
  }
  return ValidationResponse.valid();
};

export const validateNumberInput = (input) => {
  if (!input) {
    return ValidationResponse.invalid(FIELD_REQUIRED);
  } else if (typeof input !== "number") {
    return ValidationResponse.invalid(FIELD_MUST_BE_NUMBER);
  }
  return ValidationResponse.valid();
};

export const validateOption = (input, options) => {
  if (!input) {
    return ValidationResponse.invalid(FIELD_REQUIRED);
  } else if (!options.some((option) =>
    Object.entries(option).every(([key, value]) => input[key] === value)
  )) {
    return ValidationResponse.invalid(OPTION_NOT_VALID);
  }
  return ValidationResponse.valid();
};

export const valueIsEmpty = (value) => {
  return (
    value === null ||
    value === undefined ||
    value === '' ||
    (Array.isArray(value) && value.length === 0) ||
    (typeof value === 'object' && value !== null && !Array.isArray(value) && Object.keys(value).length === 0)
  );
};

export {
  ValidationResponse
};