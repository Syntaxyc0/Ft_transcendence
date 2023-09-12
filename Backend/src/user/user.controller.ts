import { Controller, Get, Req, UseGuards, Request, Body, Post, Param } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from '@prisma/client';
import { getMetadataStorage } from 'class-validator';
import { get } from 'http';
import { userInfo } from 'os';
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';
import { UserService } from './user.service';

// @UseGuards(JwtGuard)
@Controller('users')
export class UserController {
	constructor(private userService: UserService) {}

	@Get(':login')
	getMe(@Param('login') login)
	{
		return this.userService.getMe(login)
	}
    
}