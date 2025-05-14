import { IsEmail, IsInt, IsString, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'Alice' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'alice@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 25, minimum: 18 })
  @IsInt()
  @Min(18)
  age: number;

  @ApiProperty({ example: 'securePassword123' })
  @IsString()
  password: string;
}
