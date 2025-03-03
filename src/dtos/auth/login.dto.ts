import { IsEmail, IsString, MinLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class LoginDto {
    @ApiProperty({
        description: 'The email of the user',
        example: 'user@example.com'
    })
    @IsString()
    @IsEmail({}, { message: "Invalid email format" })
    username: string;

    @ApiProperty({
        description: 'The password of the user',
        example: 'password123!'
    })
    @IsString()
    @MinLength(8, { message: "Password must be at least 8 characters long" })
    password: string;
}

export class LoginResponseDto {
    @ApiProperty({
        description: 'The access token of the user',
        example: 'access-token'
    })
    @IsString()
    access_token: string;

    @ApiProperty({
        description: 'The refresh token of the user',
        example: 'refresh-token'
    })
    @IsString()
    refresh_token: string;
}

export class JWTPayload {
    @IsString()
    email: string;

    @IsString()
    sub: string;
}