import { registerDecorator, ValidationArguments, ValidationOptions } from "class-validator";

/**
 * Decorator to validate that related property doesn't match value of the property.
 *
 * @param property - The property to compare with.
 * @param validationOptions - Optional validation options.
 */
export function NotMatch(property: string, validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: "Not Match",
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [property],
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          const relatedValue = (args.object as any)[relatedPropertyName];
          return value !== relatedValue;
        },
        defaultMessage(args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          return `${args.property} mustn't match ${relatedPropertyName}`;
        }
      }
    });
  };
}
