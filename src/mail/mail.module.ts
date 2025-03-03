import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
    imports: [
        ConfigModule,
        MailerModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                transport: {
                    host: configService.get('EMAIL_HOST'),
                    port: parseInt(configService.get('EMAIL_PORT') || '587'),
                    secure: configService.get('EMAIL_SECURE') === 'true',
                    auth: {
                        user: configService.get('EMAIL_USERNAME'),
                        pass: configService.get('EMAIL_PASSWORD'),
                    },
                }
            })
        })
    ],
    controllers: [],
    providers: [MailService],
    exports: [MailService],
})
export class MailModule { }
