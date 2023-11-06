import { Module } from '@nestjs/common';
import { ChatGateway } from './gateway/chat/chat.gateway';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';
import { RoomService } from './service/room.service';

@Module({
	imports: [ AuthModule, UserModule ],
	providers: [ChatGateway, RoomService]
})
export class ChatModule {}
