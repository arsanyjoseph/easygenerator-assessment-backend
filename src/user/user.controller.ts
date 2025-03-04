import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from 'src/dtos/users/create-user.dto';
import { UserResponseDto } from 'src/dtos/users/user-response.dto';
import { Public } from 'src/decorators/public.decorator';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Public()
  @Post()
  create(@Body() createUserDto: CreateUserDto): Promise<UserResponseDto> {
    return this.userService.create(createUserDto);
  }
}
