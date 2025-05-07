import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegistrationDto } from './dto/registration-dto';
import { LoginDto } from './dto/login-dto';
import { User } from '../users/user.entity';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() loginDto: LoginDto): Promise<{ access_token: string }> {
    return this.authService.login(loginDto);
  }

  @Post('register')
  register(
    @Body() registerDto: RegistrationDto,
  ): Promise<Omit<User, 'password'>> {
    return this.authService.register(registerDto);
  }
}
