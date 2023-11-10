import { Controller, Get } from '@nestjs/common';
import { UserService } from './chat.service';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  async getUsers() {
    const users = await this.userService.getUsers();
    return "hello world";
  }
}


