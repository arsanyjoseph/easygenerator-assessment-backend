import { Module } from '@nestjs/common';
import { PasswordService } from './password-service/password.service';

@Module({
    imports: [],
    providers: [PasswordService],
    exports: [PasswordService],
})
export class UtilsModule { }
