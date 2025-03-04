import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './user.schema';
import { PasswordService } from 'src/utils/password-service/password.service';
import { MailModule } from 'src/mail/mail.module';
import { UserCreatedListener } from './listeners/UserCreated.listener';
import { AuthService } from 'src/auth/auth.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MailModule,
  ],
  providers: [UserService, PasswordService, AuthService, UserCreatedListener],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
