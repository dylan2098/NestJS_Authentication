import {
  Get,
  Body,
  Controller,
  HttpStatus,
  Post,
  UseGuards,
  Req,
  BadRequestException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { Users } from 'src/entities/users.entity';
import { LocalAuthGuard } from 'src/guards/local-auth.guard';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService,
  ) {}

  @Post('register')
  async register(@Body() userData: Partial<Users>) {
    const response = await this.userService.createUser(userData);
    return {
      statusCode: HttpStatus.OK,
      data: response,
    };
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@Req() req: any) {
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  profile(@Req() req: any) {
    return req.user;
  }

  @UseGuards(JwtAuthGuard)
  @Post('refresh-token')
  async refreshToken(@Body() { refresh_token }: { refresh_token: string }) {
    if (!refresh_token) {
      throw new BadRequestException('Refresh token is required.');
    }

    const user = await this.authService.verifyRefreshToken(refresh_token);
    if (!user) {
      throw new BadRequestException('Invalid refresh token');
    }

    return this.authService.login(user);
  }
}
