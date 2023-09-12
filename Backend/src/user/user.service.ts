import { PrismaService } from "src/prisma/prisma.service";
import { Injectable } from "@nestjs/common";

@Injectable()
export class UserService
{
	constructor(private prisma: PrismaService) {}

	getMe(login:string) {
        return this.prisma.user.findUnique(
			{
				where: {
					login: login
				},
			},
		)
    }
}

