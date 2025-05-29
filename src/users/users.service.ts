import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from './dto';
import { User } from './user.entity';
import { DeleteResult, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { instanceToPlain } from 'class-transformer';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async getAll(): Promise<Omit<User, 'password'>[]> {
    const users: User[] = await this.userRepository.find();
    return instanceToPlain(users) as Omit<User, 'password'>[];
  }

  async getById(id: number): Promise<Omit<User, 'password'> | null> {
    const user: User | null = await this.userRepository.findOneBy({ id });

    if (!user) {
      throw new HttpException(`User not found`, 404);
    }

    return instanceToPlain(user) as Omit<User, 'password'>;
  }

  async create(createUserDto: CreateUserDto): Promise<Omit<User, 'password'>> {
    const email = createUserDto.email;
    const userExists = await this.userRepository.findOneBy({
      email,
    });

    if (userExists) {
      throw new BadRequestException(
        `User with email ${email} already registered`,
      );
    }

    const user: User = new User();
    Object.assign(user, createUserDto);
    user.isActive = true;
    user.password = await bcrypt.hash(createUserDto.password, 10);

    const createdUser: User = await this.userRepository.save(user);
    return instanceToPlain(createdUser) as Omit<User, 'password'>;
  }

  async update(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<Omit<User, 'password'>> {
    const user: User | null = await this.userRepository.findOneBy({ id });

    if (!user) {
      throw new HttpException(`User not found`, 400);
    }

    const cleanDto = Object.fromEntries(
      Object.entries(updateUserDto).filter(([_, value]) => value !== undefined),
    );
    Object.assign(user, cleanDto);

    const updatedUser: User = await this.userRepository.save(user);
    return instanceToPlain(updatedUser) as Omit<User, 'password'>;
  }

  delete(id: number): Promise<DeleteResult> {
    return this.userRepository.delete({ id });
  }
}
