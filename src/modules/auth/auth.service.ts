import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { Users } from 'src/entities/users.entity';
@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService
  ) {}

  async login(user: Users) {
    const payload = { username: user.username, id: user.id };
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: "7d"
    });

    this.userService.saveRefreshToken(refreshToken, user.id)

    return {
      access_token: this.jwtService.sign(payload),
      refresh_token: refreshToken
    }
  }

  async verifyRefreshToken(refreshToken: string) {
    const decode = this.jwtService.decode(refreshToken);
    if(decode) {
      return await this.userService.verifyRefreshToken(refreshToken, decode.id);
    }

    return false;
  }
}
