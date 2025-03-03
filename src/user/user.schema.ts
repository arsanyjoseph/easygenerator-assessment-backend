
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
    @ApiProperty({
        description: 'The name of the user',
        example: 'John Doe'
    })
    @Prop({ required: true, minlength: 3 })
    name: string;

    @ApiProperty({
        description: 'The email of the user',
        example: 'user@example.com'
    })
    @Prop({ required: true, unique: true })
    email: string;

    @ApiProperty({
        description: 'The email of the user',
        example: 'user@example.com'
    })
    @Prop({ default: false })
    isActive: boolean;

    @ApiProperty({
        description: 'The password of the user',
        example: 'password123!'
    })
    @Prop({ required: true, select: false })
    password: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
