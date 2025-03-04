import { IsString, IsEmail, MinLength, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Match } from 'src/validation/passwordMatcher';

export class CreateUserDto {
  @ApiProperty({
    description: 'The name of the user',
    example: 'John Doe',
  })
  @IsString()
  @MinLength(3, { message: 'Name must be at least 3 characters long' })
  name: string;

  @ApiProperty({
    description: 'The email of the user',
    example: 'user@example.com',
  })
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @ApiProperty({
    description: 'The password of the user',
    example: 'password123!',
  })
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @Matches(/[a-zA-Z]/, { message: 'Password must contain at least one letter' })
  @Matches(/\d/, { message: 'Password must contain at least one number' })
  @Matches(/[@$!%*?&]/, {
    message: 'Password must contain at least one special character (@$!%*?&)',
  })
  password: string;

  @ApiProperty({
    description: 'The password of the user',
    example: 'password123!',
  })
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @Matches(/[a-zA-Z]/, { message: 'Password must contain at least one letter' })
  @Matches(/\d/, { message: 'Password must contain at least one number' })
  @Matches(/[@$!%*?&]/, {
    message: 'Password must contain at least one special character (@$!%*?&)',
  })
  @Match('password', { message: 'Confirm password must match password' })
  confirmPassword: string;
}
