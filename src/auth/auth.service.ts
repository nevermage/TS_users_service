import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RegistrationDto } from './dto/registration-dto';
import { LoginDto } from './dto/login-dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { instanceToPlain } from 'class-transformer';
import { User } from '../users/user.entity';
import { JWTPayload } from './types/jwtPayload';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto): Promise<{ access_token: string }> {
    const email: string = loginDto.email;
    const password: string = loginDto.password;
    const user: User | null = await this.userRepository.findOneBy({ email });

    if (!user) {
      throw new UnauthorizedException(
        `User with email ${email} is not registered`,
      );
    }

    if (!(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload: JWTPayload = {
      userId: user.id,
      username: user.name,
      email: user.email,
      role: user.role,
    };

    return { access_token: this.jwtService.sign(payload) };
  }

  async register(
    registerDto: RegistrationDto,
  ): Promise<Omit<User, 'password'>> {
    const email = registerDto.email;
    const userExists = await this.userRepository.findOneBy({
      email,
    });

    if (userExists) {
      throw new BadRequestException(
        `User with email ${email} already registered`,
      );
    }

    const user = new User();
    Object.assign(user, registerDto);
    user.password = await bcrypt.hash(registerDto.password, 10);
    user.isActive = true;

    const savedUser: User = await this.userRepository.save(user);
    return instanceToPlain(savedUser) as Omit<User, 'password'>;
  }
}
