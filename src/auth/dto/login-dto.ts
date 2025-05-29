import { IsEmail, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    example: 'alice@example.com',
    description: 'User email address',
    required: true,
  })
  @IsEmail()
  @IsString()
  email: string;

  @ApiProperty({
    example: '*******',
    description: 'User password',
    required: true,
  })
  @IsString()
  password: string;
}
