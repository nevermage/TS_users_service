import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../types/role';

export class SafeUserDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  role: Role;

  @ApiProperty()
  email: string;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty()
  age: number;
}
