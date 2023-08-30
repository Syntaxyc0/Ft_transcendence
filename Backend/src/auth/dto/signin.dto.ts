import { IsEmail, IsNotEmpty, IsString} from "class-validator"

export class signinDto
{
    @IsString()
    @IsEmail()
    @IsNotEmpty()
    mail: string

    @IsString()
    @IsNotEmpty()
    password: string
}