import { Controller, Get, Post, Body } from '@nestjs/common';
import { UserService } from './user.service';
import { UserEntity } from './user.entity';
import { UserDTO } from './dto/user.dto';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('users')
  async allUsers(): Promise<UserEntity[]> {
    return await this.userService.allUsers();
  }

  @Post('login')
  async login(@Body() loginData: UserDTO): Promise<string> {
    return await this.userService.login(loginData);
  }

  @Post('register')
  async register(@Body() registerData: UserDTO): Promise<string> {
    return await this.userService.register(registerData);
  }
}
