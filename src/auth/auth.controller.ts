import { Body, Controller, Get, HttpCode, Post, Req, Request, Res } from '@nestjs/common';
import { Response, Request as ExpressRequest } from 'express';
import { AuthService } from './auth.service';
import { LoginDto, LoginResponseDto } from 'src/dtos/auth/login.dto';
import { Public } from 'src/decorators/public.decorator';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserResponseDto } from 'src/dtos/users/user-response.dto';
import { VerificationTokenDto } from 'src/dtos/auth/verification-token.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @ApiOperation({ summary: 'Login user' })
    @ApiResponse({
        status: 200,
        description: 'User logged in successfully.',
        type: LoginResponseDto
    })
    @HttpCode(200)
    @Public()
    @Post('login')
    async login(@Body() loginDto: LoginDto, @Res({ passthrough: true }) res: Response
    ): Promise<{ access_token: string }> {
        const { access_token, refresh_token } = await this.authService.login(loginDto);

        res.cookie('refresh_token', refresh_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            path: '/auth/refresh-token',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return { access_token };
    }

    @ApiOperation({ summary: 'Refresh access token' })
    @ApiResponse({
        status: 200,
        description: 'Access token refreshed successfully.',
        type: LoginResponseDto
    })
    @HttpCode(200)
    @Post('refresh-token')
    refreshToken(@Req() req: ExpressRequest) {
        const refreshToken = req.cookies['refresh_token'];
        return this.authService.refreshToken(refreshToken);
    }

    @ApiOperation({ summary: 'Verify User' })
    @ApiResponse({
        status: 200,
        description: 'User verified successfully.',
    })
    @HttpCode(200)
    @Public()
    @Post('verify-user')
    async verifyUser(@Body() verificationTokenDto: VerificationTokenDto) {
        const isVerified = await this.authService.verifyUser(verificationTokenDto.verificationToken);
        return { isVerified };
    }

    @ApiOperation({ summary: 'Get user profile' })
    @ApiResponse({
        status: 200,
        description: 'User profile retrieved successfully.',
        type: UserResponseDto
    })
    @Get('profile')
    profile(@Request() request) {
        return request.user;
    }
}
