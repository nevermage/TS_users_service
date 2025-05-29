import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto, SafeUserDto } from './dto';
import { User } from './user.entity';
import { DeleteResult } from 'typeorm';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from './types/role';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AdminOrOwnerGuard, RolesGuard } from '../common/guards';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, type: [SafeUserDto] })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  getAll(): Promise<Omit<User, 'password'>[]> {
    return this.usersService.getAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by id' })
  @ApiResponse({ status: 200, type: SafeUserDto })
  @ApiResponse({ status: 404, description: 'User not found' })
  @UseGuards(JwtAuthGuard, RolesGuard, AdminOrOwnerGuard)
  getById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Omit<User, 'password'> | null> {
    return this.usersService.getById(id);
  }

  @Post('/create')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: 201, type: SafeUserDto })
  @ApiResponse({ status: 400, description: 'User already exists' })
  create(
    @Body() createUserDto: CreateUserDto,
  ): Promise<Omit<User, 'password'>> {
    return this.usersService.create(createUserDto);
  }

  @Put('/update/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Update user by id' })
  @ApiResponse({ status: 200, type: SafeUserDto })
  @ApiResponse({ status: 400, description: 'User not found' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<Omit<User, 'password'>> {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete('/delete/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Delete user by id' })
  @ApiResponse({ status: 200, type: DeleteResult })
  delete(@Param('id', ParseIntPipe) id: number): Promise<DeleteResult> {
    return this.usersService.delete(id);
  }
}
