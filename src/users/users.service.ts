import { HttpException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user-dto';
import { UpdateUserDto } from './dto/update-user-dto';
import { User } from './user.entity';
import { DeleteResult, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  getAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  getById(id: number): Promise<User | null> {
    return this.userRepository.findOneBy({ id });
  }

  create(createUserDto: CreateUserDto): Promise<User> {
    const user: User = new User();
    Object.assign(user, createUserDto);
    user.isActive = false;

    return this.userRepository.save(user);
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user: User | null = await this.getById(id);

    if (!user) {
      throw new HttpException(`User with id ${id} not found`, 400);
    }

    const cleanDto = Object.fromEntries(
      Object.entries(updateUserDto).filter(([_, value]) => value !== undefined),
    );
    Object.assign(user, cleanDto);

    return this.userRepository.save(user);
  }

  delete(id: number): Promise<DeleteResult> {
    return this.userRepository.delete({ id });
  }
}
