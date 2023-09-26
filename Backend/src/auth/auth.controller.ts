import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, Res, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { signinDto, signupDto } from "./dto";
import { dot } from "node:test/reporters";
import { HttpService } from "@nestjs/axios";
import { FortyTwoAuthGuard } from "./guard/42.guard";
import { map } from "rxjs";
import { Response } from "express";

@Controller('auth')
export class AuthController
{
    constructor(private authService: AuthService, private http: HttpService) {}

    @Post('signup')
    signup(@Body() dto: signupDto) {
        return this.authService.signup(dto);
    }

	@HttpCode(HttpStatus.OK)
    @Post('signin')
    signin(@Body() dto: signinDto)
    {
        return this.authService.signin(dto) ;
    }

	@Get('42auth')
	@UseGuards(FortyTwoAuthGuard)
	get42auth(@Res() res: Response)
	{
		const clientID = process.env.FOURTYTWO_CLIENT_ID;
		const clientSecret = process.env.FOURTYTWO_CLIENT_SECRET;
		const callbackURL = process.env.FOURTYTWO_CALLBACK_URL;
		res.redirect("https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-000e4b8f9307f65844fe94cf2de9ad19e124143666cadeb78d8a1b7755a42b3f&redirect_uri=http%3A%2F%2Flocalhost%3A4200%2Fhome&response_type=code")
	}
	
	@Get('42redirect')
	@UseGuards(FortyTwoAuthGuard)
	get42redirect(@Res() res: Response) {

		res.redirect(process.env.FOURTYTWO_CALLBACK_URL)
		return 
	}



}