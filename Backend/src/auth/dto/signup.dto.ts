import { IsEmail, IsNotEmpty, IsString} from "class-validator"
import passport from "passport"
import { Match } from "../decorator"

//strong password policy ?

export class signupDto
{
    @IsString()
    @IsEmail()
    @IsNotEmpty()
    mail: string

    @IsString()
    @IsNotEmpty()
    password: string

	@IsString()
    @IsNotEmpty()
	@Match('password')
    confirm_password: string
}