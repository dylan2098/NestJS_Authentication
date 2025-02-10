import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  NotFoundException,
  Param,
} from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':id')
  async findUser(@Param('id') id: number) {
    const user = await this.usersService.findById(id);
    if (!user)
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);;

    return user;
  }
}
