type RuleFunction = (fieldName: string) => {
  [key: string]: any;
};

export const validOnlyLettersOrNumbersRegex = /^[A-Za-z0-9]+$/;

const isSingular = (value: number) => value === 1;

export const requiredRule = (fieldName: string) => {
  return {
    required: {
      value: true,
      message: `${fieldName} is required`,
    },
  };
};

export const minLengthRule = (value: number) => (fieldName: string) => {
  return {
    minLength: {
      value,
      message: `${fieldName} has to have minimum ${value} character${
        isSingular(value) ? "" : "s"
      }`,
    },
  };
};

export const maxLengthRule = (value: number) => (fieldName: string) => {
  return {
    maxLength: {
      value,
      message: `${fieldName} can have maximum ${value} character${
        isSingular(value) ? "" : "s"
      }`,
    },
  };
};

export const onlyLettersOrNumbers = (fieldName: string) => {
  const errorMessage = `${fieldName} must contain only letters or numbers, no special characters`;

  return {
    validate: {
      checkHaveOnlyLettersOrNumbers: (value: string) => {
        if (!value) return true;
        return validOnlyLettersOrNumbersRegex.test(value) || errorMessage;
      },
    },
  };
};

export const applyRules = (
  fieldName: string = "",
  rules: RuleFunction[] = []
) => {
  if (!rules) return {};

  let combinedRules: { validate?: any } = {};

  rules.forEach((rule) => {
    const ruleObject = rule(fieldName);
    const hasValidate = ruleObject.hasOwnProperty("validate");

    const newRules = hasValidate
      ? {
          validate: {
            ...combinedRules?.validate,
            ...ruleObject.validate,
          },
        }
      : ruleObject;

    combinedRules = { ...combinedRules, ...newRules };
  });

  return combinedRules;
};
