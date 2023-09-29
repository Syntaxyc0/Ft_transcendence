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
	

	@Post('42redirect')
	async get42redirect(@Req() request, @Res() res)  {

		const formData = new FormData();
		formData.append('grant_type', 'authorization_code');
		formData.append('client_id', process.env.FOURTYTWO_CLIENT_ID);
		formData.append('client_secret', process.env.FOURTYTWO_CLIENT_SECRET);
		formData.append('redirect_uri', process.env.FOURTYTWO_CALLBACK_URL);
		formData.append('code', request.body.code );
		// const payload = {
		// 	grant_type: 'authorization_code',
		// 	client_id: process.env.FOURTYTWO_CLIENT_ID,
		// 	client_secret: process.env.FOURTYTWO_CLIENT_SECRET,
		// 	code: res.req.query.code,
		// 	redirect_uri: "http://localhost:3333/auth/42redirect"

		// }
		const response = await fetch('https://api.intra.42.fr/oauth/token', {
			method: 'POST',
			body: formData
		})

		const tokens = await response.json();
		const headers = {Authorization: 'Bearer ' + tokens.access_token}

		const resp2 = await fetch('https://api.intra.42.fr/v2/me', {headers})
		if (!resp2.ok)
			throw new Error('user not found')
		const data = await resp2.json();
		console.log(data.login)
		console.log(data.email)
		// console.log(tokens);
		// res.cookie('access_token', this.token )
		// res.send(tokens)
		return 	

		
	}
}