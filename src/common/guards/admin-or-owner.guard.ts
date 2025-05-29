import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Role } from '../../users/types/role';
import { JWTPayload } from '../../auth/types/jwtPayload';
import { RequestWithUser } from '../types/requestWithUser';

@Injectable()
export class AdminOrOwnerGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request: RequestWithUser = context.switchToHttp().getRequest();
    const user: JWTPayload = request.user;

    if (user.role === Role.Admin) return true;

    const requestedUserId: number = parseInt(request.params.id);

    if (user.userId !== requestedUserId) {
      throw new ForbiddenException('Access denied');
    }

    return true;
  }
}
