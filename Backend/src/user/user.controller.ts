import { Controller, Get, Req, UseGuards, Request, Body, Post, Param, ParseIntPipe, NotFoundException } from '@nestjs/common';
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

	@Get(':uid')
	getUserFromId(@Param('uid', ParseIntPipe) uid: number)
	{
		const user = this.userService.getUserFromId(uid)
		if (!user)
		{
            throw new NotFoundException('User not found');
        }
		return user;
	}
    
}