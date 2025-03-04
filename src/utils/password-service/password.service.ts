import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class PasswordService {
    private readonly saltOrRound: string | number;
    constructor() {
        this.saltOrRound = bcrypt.genSaltSync(10);
    }
    
    async hashPassword(password: string): Promise<string> {
        return bcrypt.hash(password, this.saltOrRound);
    }

    async comparePassword(password: string, hashedPassword: string): Promise<boolean> {
        return bcrypt.compare(password, hashedPassword);
    }
}
