import { Body, Controller, Get, HttpCode, HttpStatus, Options, Param, Post, Req, Res, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { signinDto, signupDto } from "./dto";
import { dot } from "node:test/reporters";
import { HttpService } from "@nestjs/axios";
import { map } from "rxjs";
import { Response } from "express";


@Controller('auth')
export class AuthController
{
    constructor(private authService: AuthService, private http: HttpService) {}

	token: string
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
	get42auth(@Res() res: Response)
	{
		const clientID = process.env.FOURTYTWO_CLIENT_ID;
		const clientSecret = process.env.FOURTYTWO_CLIENT_SECRET;
		const callbackURL = process.env.FOURTYTWO_CALLBACK_URL;
	}
	
	@Get('42redirect')
	async get42redirect(@Res({passthrough: true}) res: Response, @Req() request)  {

		const payload = {
			grant_type: 'authorization_code',
			client_id: process.env.FOURTYTWO_CLIENT_ID,
			client_secret: process.env.FOURTYTWO_CLIENT_SECRET,
			code: res.req.query.code,
			redirect_uri: "http://localhost:3333/auth/42redirect"

		}
		this.http.post("https://api.intra.42.fr/oauth/token", payload).subscribe(
			ret => {
				this.token = ret.data.access_token;
			},
			err => console.log(err)
		)
		res.cookie('access_token', this.token )
		res.redirect("http://localhost:4200/home")
		return 	

		
	}
}