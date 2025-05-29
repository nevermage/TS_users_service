import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Role } from './types/role';
import { DeleteResult } from 'typeorm';
import { instanceToPlain } from 'class-transformer';
import { CreateUserDto } from './dto';
import { BadRequestException } from '@nestjs/common';

describe('UsersController', () => {
  let controller: UsersController;

  const mockUserRepository = {
    find: jest.fn(),
    findOneBy: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
  };

  const users: User[] = [
    {
      id: 1,
      name: 'Alice',
      role: Role.User,
      email: 'alice@example.com',
      isActive: true,
      age: 30,
      password: 'hashed_password',
    },
    {
      id: 2,
      name: 'Bob',
      role: Role.Admin,
      email: 'bob@example.com',
      isActive: true,
      age: 40,
      password: 'hashed_password_2',
    },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return all users without password', async () => {
    mockUserRepository.find.mockResolvedValue(users);

    const result = await controller.getAll();

    expect(result).toEqual(instanceToPlain(users));
    expect(mockUserRepository.find).toHaveBeenCalled();
  });

  it('should return user without password', async () => {
    const user: User = users.find((user) => user.id === 2) as User;

    mockUserRepository.findOneBy.mockResolvedValue(user);

    const result = await controller.getById(2);

    expect(result).toEqual(instanceToPlain(user));
    expect(mockUserRepository.findOneBy).toHaveBeenCalled();
  });

  it('should create a user', async () => {
    const newUser: User = {
      id: 3,
      name: 'Charlie',
      role: Role.User,
      email: 'charlie@example.com',
      isActive: true,
      age: 25,
      password: 'new_hashed_password',
    };

    mockUserRepository.findOneBy.mockResolvedValue(false);
    mockUserRepository.save.mockResolvedValue(newUser);

    const result = await controller.create({
      name: 'Charlie',
      email: 'charlie@example.com',
      password: 'new_hashed_password',
      age: 25,
    });

    expect(result).toEqual(instanceToPlain(newUser));
    expect(mockUserRepository.save).toHaveBeenCalled();
  });

  it('should not create a user if email already used', async () => {
    const newUser: User = {
      id: 3,
      name: 'Charlie',
      role: Role.User,
      email: 'charlie@example.com',
      isActive: true,
      age: 25,
      password: 'new_hashed_password',
    };

    mockUserRepository.findOneBy.mockResolvedValue(newUser);
    mockUserRepository.save.mockResolvedValue(newUser);

    const creteUserDto: CreateUserDto = {
      name: 'Charlie',
      email: 'charlie@example.com',
      password: 'new_hashed_password',
      age: 25,
    };

    await expect(controller.create(creteUserDto)).rejects.toThrow(
      BadRequestException,
    );
    expect(mockUserRepository.save).toHaveBeenCalled();
  });

  it('should delete a user', async () => {
    const deleteResult: DeleteResult = {
      affected: 1,
      raw: undefined,
    };

    mockUserRepository.delete.mockResolvedValue(deleteResult);

    const result = await controller.delete(1);

    expect(result).toEqual(deleteResult);
    expect(mockUserRepository.delete).toHaveBeenCalledWith({ id: 1 });
  });
});
