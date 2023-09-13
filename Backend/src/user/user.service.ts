import { PrismaService } from "src/prisma/prisma.service";
import { Injectable } from "@nestjs/common";

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
}

