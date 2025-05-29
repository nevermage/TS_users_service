import { Role } from '../../users/types/role';

export interface JWTPayload {
  userId: number;
  email: string;
  username: string;
  role: Role;
}
