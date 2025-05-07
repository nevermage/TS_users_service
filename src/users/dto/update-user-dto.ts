import { IsEmail, IsInt, IsOptional, IsString, Min } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsInt()
  @Min(18)
  @IsOptional()
  age?: number;
}
