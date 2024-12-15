import { registerDecorator, ValidationOptions } from "class-validator";
import { VALIDATION_ERROR_CODES, VALIDATION_RULES, ValidationErrorCodesEnum } from "@ssmovzh/chatterly-common-utils";
import { ValidationRulesEnum } from "@ssmovzh/chatterly-common-utils";

/**
 * Decorator to validate password strength.
 *
 * @param validationOptions - Optional validation options.
 */
export function IsStrongPassword(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: "IsStrongPassword",
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          // Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character
          return typeof value === "string" && (VALIDATION_RULES.get(ValidationRulesEnum.PASSWORD_REGEX).value as RegExp).test(value);
        },
        defaultMessage() {
          return VALIDATION_ERROR_CODES.get(ValidationErrorCodesEnum.WEAK_PASSWORD).msg;
        }
      }
    });
  };
}
