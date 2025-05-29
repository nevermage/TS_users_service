import { IsEmail, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty({ example: 'Alice', required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ example: 'alice@example.com', required: false })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({ example: 30, required: false, minimum: 18 })
  @IsInt()
  @Min(18)
  @IsOptional()
  age?: number;
}
