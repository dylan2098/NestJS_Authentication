import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { Users } from 'src/entities/users.entity';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService,
  ) {}

  @Post('/register')
  async register(@Body() userData: Partial<Users>) {
    const response = await this.userService.createUser(userData);
    return {
      statusCode: HttpStatus.OK,
      data: response,
    };
  }
}
