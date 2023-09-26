import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { PrismaModule } from "src/prisma/prisma.module";
import { JwtModule } from "@nestjs/jwt";
import { JwtStrategy } from "./strategy";
import { FortytwoStrategy } from "./strategy/42strategy";
import { HttpModule, HttpService } from "@nestjs/axios";

@Module({
    imports: [PrismaModule, JwtModule, HttpModule],
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy, FortytwoStrategy],
})
export class AuthModule {}
