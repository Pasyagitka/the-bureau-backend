import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'isAfter', async: false })
export class IsAfterConstraint implements ValidatorConstraintInterface {
  validate(propertyValue: string, args: ValidationArguments) {
    return propertyValue > args.object[args.constraints[0]];
  }

  defaultMessage(args: ValidationArguments) {
    return `${args.property} must be before ${args.constraints[0]}`;
  }
}
