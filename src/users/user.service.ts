import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from 'src/dtos/create-user.dto';
import { UserEntity } from 'src/entities/user.entity';
import { GetUserOutput } from 'src/interface/output/get-user-output';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  create(createUser: CreateUserDto) {
    const user = this.userRepository.create(createUser);

    return this.userRepository.save(user);
  }

  findOne(id: number) {
    if (!id) {
      return null;
    }
    return this.userRepository.findOne({ where: { id } });
  }

  async findOneByEmail(email: string): Promise<GetUserOutput> {
    return this.userRepository.findOne({ where: { email } });
  }

  findAll(): Promise<GetUserOutput[]> {
    return this.userRepository.find();
  }

  async remove(id: number) {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException('user not found');
    }
    return this.userRepository.remove(user);
  }
}
