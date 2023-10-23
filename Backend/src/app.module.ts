import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { GameModule } from './game/game.module';
import { GameGateway } from './game/game.gateway';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true,}), AuthModule, UserModule, PrismaModule, GameModule],
  providers: [GameGateway],
})
export class AppModule {}
