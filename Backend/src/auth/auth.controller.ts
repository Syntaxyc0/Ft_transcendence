import { Body, Controller, Get, HttpCode, HttpStatus, Options, Param, Post, Req, Res, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { signinDto, signupDto } from "./dto";
import { dot } from "node:test/reporters";
import { HttpService } from "@nestjs/axios";
import { map } from "rxjs";
import { Response } from "express";
import fetch from 'node-fetch';

import FormData = require('form-data');

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
	
	@Post('42redirect')
	async get42redirect(@Req() request)  {

		console.log(request.body)
		const formData = new FormData();
		formData.append('grant_type', 'authorization_code');
		formData.append('client_id', process.env.FOURTYTWO_CLIENT_ID);
		formData.append('client_secret', process.env.FOURTYTWO_CLIENT_SECRET);
		formData.append('redirect_uri', process.env.FOURTYTWO_CALLBACK_URL);
		formData.append('code', 'fa60d58d6f8c5b42cb6e3350d4a775c51752c7062d05fed80f06c0cce410ae2a' );
		// const payload = {
		// 	grant_type: 'authorization_code',
		// 	client_id: process.env.FOURTYTWO_CLIENT_ID,
		// 	client_secret: process.env.FOURTYTWO_CLIENT_SECRET,
		// 	code: res.req.query.code,
		// 	redirect_uri: "http://localhost:3333/auth/42redirect"

		// }
		const response = await fetch('https://api.intra.42.fr/oauth/token', {
			method: 'POST',
			body: JSON.stringify(formData)
		})

		const tokens = await response.json();
		console.log(tokens);
		// res.cookie('access_token', this.token )
		// res.redirect("http://localhost:4200/home")
		return 	

		
	}
}