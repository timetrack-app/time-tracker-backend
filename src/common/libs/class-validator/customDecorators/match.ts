import {registerDecorator, ValidationArguments, ValidationOptions, } from 'class-validator';

// https://github.com/typestack/class-validator#custom-validation-decorators
// https://stackoverflow.com/questions/60451337/password-confirmation-in-typescript-with-class-validator

/**
 * Check if the property given as an argument and the value of the validation target property are the same
 *
 * usage:
 * ```
 * @IsString()
 * password: string;
 *
 * @Match('password')
 * passwordConfirmation: string;
 * ```
 *
 * @param {string} property
 * @param {ValidationOptions} [validationOptions]
 * @return {(object: any, propertyName: string) => void}
 */
export const Match = (property: string, validationOptions?: ValidationOptions) => {
  return (object: any, propertyName: string) => {
    registerDecorator({
      name: 'Match',
      target: object.constructor,
      propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          const relatedValue = (args.object as any)[relatedPropertyName];
          return value === relatedValue;
        },
        defaultMessage(args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          return `${propertyName} must match ${relatedPropertyName} exactly`;
        },
      },
    });
  };
}
