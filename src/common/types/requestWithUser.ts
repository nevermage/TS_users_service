import { Request } from 'express';
import { JWTPayload } from '../../auth/types/jwtPayload';

export interface RequestWithUser extends Request {
  user: JWTPayload;
}
