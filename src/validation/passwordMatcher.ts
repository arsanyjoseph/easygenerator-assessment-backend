import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function Match<T extends object>(
  property: keyof T & string,
  validationOptions?: ValidationOptions,
) {
  return (object: T, propertyName: string) => {
    registerDecorator({
      name: 'Match',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [property],
      validator: {
        validate(value: string, args: ValidationArguments) {
          const relatedPropertyName = args.constraints[0] as keyof T & string;
          const relatedValue = (args.object as T)[relatedPropertyName];
          return value === relatedValue;
        },
        defaultMessage(args: ValidationArguments) {
          const relatedPropertyName = args.constraints[0] as string;
          return `${args.property} must match ${relatedPropertyName}`;
        },
      },
    });
  };
}
