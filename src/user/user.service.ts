import {
  Inject,
  Injectable,
  InternalServerErrorException,
  LoggerService,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { CreateUserDto } from 'src/dtos/users/create-user.dto';
import { UserResponseDto } from 'src/dtos/users/user-response.dto';
import { User, UserDocument } from 'src/user/user.schema';
import { PasswordService } from 'src/utils/password-service/password.service';
import { UserCreatedEvent } from './events/UserCreated.event';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly passwordService: PasswordService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    try {
      const hashedPassword = await this.passwordService.hashPassword(
        createUserDto.password,
      );

      const user = new this.userModel({
        ...createUserDto,
        isActive: false,
        password: hashedPassword,
      });
      const savedUser = await user.save();

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: _password, ...result } = savedUser.toObject();
      this.logger.log(`User created: ${JSON.stringify(result)}`);
      this.eventEmitter.emit(
        'user.created',
        new UserCreatedEvent(savedUser._id, savedUser.email),
      );

      return result;
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(errorMessage);
      throw new InternalServerErrorException(errorMessage);
    }
  }

  async findOneByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email }).select('+password');
  }

  async findOneById(id: string): Promise<UserDocument | null> {
    return this.userModel.findById(id);
  }
}
