import { PrismaService } from "src/prisma/prisma.service";
import { Body, Injectable } from "@nestjs/common";
import { stat } from "fs";



@Injectable()
export class UserService
{
	constructor(private prisma: PrismaService) {}

	async getUserFromId(id: number) {
        return await this.prisma.user.findUnique(
			{
				where: {
					id: id
				},
			},
		)
    }

	async getUserFromLogin(login: string) {
        return await this.prisma.user.findUnique(
			{
				where: {
					login: login
				},
			},
		)
    }

	async updateUserStatus(id: number, @Body() status:	string)
	{
		console.log(status);
		await this.prisma.user.update({
				data: {
					userStatus: "ONLINE" ,
				},
				where: {
					id: id,
				}
			})
			
	}

	async GetUserStatus(id: number)
	{
		const user = await this.prisma.user.findUnique(
			{
				where: {
					id: id
				},
			},
		)
		return user.userStatus
	}
}

