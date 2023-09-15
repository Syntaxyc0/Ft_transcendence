import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { ServeStaticModule } from '@nestjs/serve-static';

@Module({
  controllers: [UserController],
  providers: [UserService]
})
export class UserModule {
	
}
