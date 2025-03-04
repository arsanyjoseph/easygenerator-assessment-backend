import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { validate, ValidationError } from 'class-validator';
import { plainToInstance } from 'class-transformer';

type ClassConstructor<T = unknown> = new (...args: any[]) => T;

@Injectable()
export class ValidationPipe<T extends object>
  implements PipeTransform<unknown>
{
  async transform(value: unknown, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }

    const object = plainToInstance(metatype as ClassConstructor<T>, value);
    const errors = await validate(object);

    if (errors.length > 0) {
      throw new BadRequestException(this.formatErrors(errors));
    }

    return value;
  }

  private toValidate(metatype: unknown): metatype is ClassConstructor {
    const types: ClassConstructor[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype as ClassConstructor);
  }

  private formatErrors(errors: ValidationError[]) {
    return errors.map((err) => ({
      property: err.property,
      constraints: err.constraints,
    }));
  }
}
