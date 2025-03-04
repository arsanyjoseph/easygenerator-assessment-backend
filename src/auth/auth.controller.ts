import { Body, Controller, Get, HttpCode, Post, Req, Request, } from '@nestjs/common';
import { Request as ExpressRequest } from 'express';
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
    async login(@Body() loginDto: LoginDto
    ) {
        return await this.authService.login(loginDto);
    }

    @ApiOperation({ summary: 'Refresh access token' })
    @ApiResponse({
        status: 200,
        description: 'Access token refreshed successfully.',
        type: LoginResponseDto
    })
    @HttpCode(200)
    @Post('refresh-token')
    async refreshToken(@Req() req: ExpressRequest) {
        const refreshToken = req.cookies['refresh_token'];
        return await this.authService.refreshToken(refreshToken);
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
        return this.authService.getProfile(request.user.sub);
    }
}
