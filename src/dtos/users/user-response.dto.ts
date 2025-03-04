import { OmitType } from '@nestjs/swagger';
import { User } from '../../user/user.schema';

export class UserResponseDto extends OmitType(User, ['password']) {}
