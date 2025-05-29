import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegistrationDto } from './dto/registration-dto';
import { LoginDto } from './dto/login-dto';
import { User } from '../users/user.entity';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { SafeUserDto } from '../users/dto';

@ApiTags('auth')
@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'User login' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: 200,
    description: 'Returns access token if credentials are valid',
    schema: {
      example: {
        access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  login(@Body() loginDto: LoginDto): Promise<{ access_token: string }> {
    return this.authService.login(loginDto);
  }

  @Post('register')
  @ApiOperation({ summary: 'User registration' })
  @ApiBody({ type: RegistrationDto })
  @ApiResponse({
    status: 201,
    description: 'Returns newly created user (without password)',
    type: SafeUserDto,
  })
  @ApiResponse({ status: 400, description: 'Validation error' })
  register(
    @Body() registerDto: RegistrationDto,
  ): Promise<Omit<User, 'password'>> {
    return this.authService.register(registerDto);
  }
}
