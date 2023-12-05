import { Module } from '@nestjs/common';
import { ChatGateway } from './gateway/chat.gateway';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';
import { RoomService } from './service/room.service';
import { AuthService } from 'src/auth/auth.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { HttpModule } from '@nestjs/axios';
import { ConnectedUserService } from './service/connectedUser.service';
import { JoinedRoomService } from './service/joined-room.service';
import { MessageService } from './service/message.service';

@Module({
	imports: [ AuthModule, UserModule, JwtModule, HttpModule],
	providers: [ChatGateway, RoomService, AuthService, ConnectedUserService, JoinedRoomService, MessageService]
})
export class ChatModule {
}
