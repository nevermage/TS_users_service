import { IsEmail, IsInt, IsString, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegistrationDto {
  @ApiProperty({
    example: 'alice@example.com',
    description: 'User email address',
  })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'Alice', description: 'User name' })
  @IsString()
  name: string;

  @ApiProperty({
    example: 25,
    description: 'User age (must be 18 or older)',
    minimum: 18,
  })
  @IsInt()
  @Min(18)
  age: number;

  @ApiProperty({ example: 'securePassword123', description: 'User password' })
  @IsString()
  password: string;
}
