import { Module } from '@nestjs/common';
import { GameController } from './game.controller';
import { GameService } from './game.service';
import { GameGateway } from './game.gateway';
import { SocketModule } from './socket/socket.module';

@Module({
  controllers: [GameController],
  providers: [GameService, GameGateway],
  imports: [SocketModule]
})
export class GameModule {}
