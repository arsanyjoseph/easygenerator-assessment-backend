import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './user/user.schema';
import { UtilsModule } from './utils/utils.module';
import { winstonConfig } from './logger/logger.config';
import { WinstonModule } from 'nest-winston';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { MailModule } from './mail/mail.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    WinstonModule.forRoot(winstonConfig),
    EventEmitterModule.forRoot(),
    MongooseModule.forRoot(
      process.env.DB_URI || ''
    ),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    AuthModule,
    UserModule,
    UtilsModule,
    MailModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
