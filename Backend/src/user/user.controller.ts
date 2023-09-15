import { Controller, Get, Req, UseGuards, Request, Body, Post, Param, ParseIntPipe, NotFoundException, Patch, UseInterceptors, UploadedFile } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from '@prisma/client';
import { getMetadataStorage } from 'class-validator';
import { get } from 'http';
import { Express } from 'express';
import { diskStorage } from 'multer'
import { userInfo } from 'os';
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';
import { UserService } from './user.service';
import { FileInterceptor } from '@nestjs/platform-express';

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

	@Get(':login')
    getUserFromLogin(@Param('login') login: string)
	{
		const user = this.userService.getUserFromLogin(login)
		if (!user)
		{
            throw new NotFoundException('User not found');
        }
		return user;
	}

	//Modify user status
	@Patch(':uid/status')
    updateUserStatus(@Param('uid', ParseIntPipe) uid: number, @Body() status:	string)
	{
		return this.userService.updateUserStatus(uid, status);
	}


	//get user status with its ID
	@Get(':uid/status')
    GetUserStatus(@Param('uid', ParseIntPipe) uid: number)
	{
		return this.userService.GetUserStatus(uid);
	}

	@Get(':uid/friendlist')
    GetUserFriendlist(@Param('uid', ParseIntPipe) uid:number)
	{
		return this.userService.GetUserFriendlist(uid);
	}

	@Patch(':uid/AddFriend')
    AddFriend(@Param('uid', ParseIntPipe) uid:number, @Body() userName)
	{
		return this.userService.AddFriend(uid, userName['userName']);
	}

	@Post(':uid/upload')
	@UseInterceptors(FileInterceptor('file', {
		storage: diskStorage({
			destination: 'public/img',
			filename: (req, file, cb) => {
			  cb(null, file.originalname);
			},
		  }),
		}),
	  )
	uploadFile(@Param('uid', ParseIntPipe) uid: number, @UploadedFile('file') file: Express.Multer.File)
	{
		console.log(file);
		return this.userService.uploadFile(uid, file);
	}

}