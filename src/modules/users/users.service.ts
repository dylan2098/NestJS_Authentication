import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/entities/users.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
  ) {}

  async createUser(userData: Partial<Users>): Promise<Users> {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    userData.password = hashedPassword;
    const user = this.usersRepository.create(userData);
    return this.usersRepository.save(user);
  }

  findByUser(username: string) {
    return this.usersRepository.findOneBy({ username });
  }

  findById(id: number) {
    return this.usersRepository.findOneBy({id})
  }

  async validateUser(
    username: string,
    password: string,
  ): Promise<Users | null> {
    const user = await this.findByUser(username);
    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }

    return null;
  }

  async saveRefreshToken(refreshToken: string, userId: number) {
    const user = await this.usersRepository.findOneBy({ id: userId });
    if (!user) {
      return null;
    }

    user.refresh_token = await bcrypt.hash(refreshToken, 10);
    return this.usersRepository.save(user);
  }

  async verifyRefreshToken(refreshToken: string, userId: number) {
    const user = await this.usersRepository.findOneBy({ id: userId });

    if (!user) {
      return false;
    }

    const status = await bcrypt.compare(refreshToken, user.refresh_token);
    if (status) {
      return user;
    }
  }
}
