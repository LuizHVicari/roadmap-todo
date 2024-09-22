import {
    IsEmail,
    IsNotEmpty,
    IsString,
    IsStrongPassword,
} from 'class-validator'

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    name: string

    @IsNotEmpty()
    @IsString()
    @IsEmail()
    email: string

    @IsNotEmpty()
    @IsString()
    @IsStrongPassword()
    password: string
}
