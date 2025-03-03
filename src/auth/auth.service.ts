import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JWTPayload, LoginDto, LoginResponseDto } from 'src/dtos/auth/login.dto';
import { UserService } from 'src/user/user.service';
import { PasswordService } from 'src/utils/password-service/password.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UserService,
        private readonly passwordService: PasswordService,
        private readonly jwtService: JwtService,
    ) { }

    async login(loginDto: LoginDto): Promise<LoginResponseDto> {
        const { username, password } = loginDto;
        const user = await this.usersService.findOneByEmail(username);
        if (!user) {
            throw new NotFoundException('User not found');
        }

        if (!user.isActive) {
            throw new UnauthorizedException('User is not active');
        }

        const isPasswordValid = await this.passwordService.comparePassword(password, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const access_token = this.generateAccessToken(user._id.toString(), user.email);

        const refresh_token = this.generateRefreshToken(user._id.toString(), user.email);

        return {
            access_token,
            refresh_token,
        };
    }

    async verifyUser(token: string) {
        const payload = this.jwtService.verify<JWTPayload>(token, {
            secret: process.env.JWT_VERIFICATION_TOKEN_SECRET,
        });

        const user = await this.usersService.findOneByEmail(payload.email);

        if (!user) {
            throw new NotFoundException('User not found');
        }

        user.isActive = true;
        await user.save();
        return true;
    }

    async refreshToken(refreshToken: string): Promise<LoginResponseDto> {
        const payload = this.jwtService.verify<JWTPayload>(refreshToken, {
            secret: process.env.JWT_REFRESH_TOKEN_SECRET,
        });
        if (!payload) {
            throw new UnauthorizedException('Invalid refresh token');
        }

        const access_token = this.generateAccessToken(payload.sub, payload.email);
        const refresh_token = this.generateRefreshToken(payload.sub, payload.email);

        return {
            access_token,
            refresh_token,
        };
    }

    generateAccessToken(sub: string, email: string) {
        const payload = { sub, email };
        const secret = process.env.JWT_SECRET;
        const expiresIn = process.env.JWT_EXPIRES_IN;
        if (!secret || !expiresIn) {
            throw new Error('JWT access token secret or expiry time not configured');
        }
        return this.generateToken(payload, secret, expiresIn);
    }

    generateVerificationToken(sub: string, email: string) {
        const payload = { sub, email };
        const secret = process.env.JWT_VERIFICATION_TOKEN_SECRET;
        const expiresIn = process.env.JWT_VERIFICATION_TOKEN_EXPIRES_IN;
        if (!secret || !expiresIn) {
            throw new Error('JWT verification token secret or expiry time not configured');
        }
        return this.generateToken(payload, secret, expiresIn);
    }

    generateRefreshToken(sub: string, email: string) {
        const payload = { sub, email };
        const secret = process.env.JWT_REFRESH_TOKEN_SECRET;
        const expiresIn = process.env.JWT_REFRESH_TOKEN_EXPIRES_IN;
        if (!secret || !expiresIn) {
            throw new Error('JWT refresh token secret or expiry time not configured');
        }
        return this.generateToken(payload, secret, expiresIn);
    }

    generateToken(payload: JWTPayload, secret: string, expiresIn: string) {
        const token = this.jwtService.sign(payload, {
            secret,
            expiresIn,
        });
        return token;
    }

}
