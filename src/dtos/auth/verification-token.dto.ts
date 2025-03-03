import { IsString, IsNotEmpty } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class VerificationTokenDto {
    @IsString({message: "Verification token must be a string"})
    @IsNotEmpty({message: "Verification token must not be empty"})
    @ApiProperty({
        description: 'The verification token of the user',
        example: 'verification-token'
    })
    verificationToken: string;
}