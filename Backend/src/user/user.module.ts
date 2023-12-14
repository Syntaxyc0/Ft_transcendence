import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { ServeStaticModule } from '@nestjs/serve-static';
import { MailModule } from 'src/mail/mail.module';
import { MailService } from 'src/mail/mail.service';

@Module({
  imports: [MailModule],
  controllers: [UserController],
  providers: [UserService, MailService]
})
export class UserModule {
	
}
