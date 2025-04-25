import { IsEmail, IsInt, IsString, Min } from 'class-validator';

export class RegistrationDto {
  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  name: string;

  @IsInt()
  @Min(18)
  age: number;

  @IsString()
  password: string;
}
