import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/entities/users.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
  ) {}

  createUser(userData: Partial<Users>): Promise<Users> {
    const user = this.usersRepository.create(userData);
    return this.usersRepository.save(user);
  }
}
