import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { Role } from '../../users/types/role';
import { JWTPayload } from '../../auth/types/jwtPayload';
import { RequestWithUser } from '../types/requestWithUser';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) return true;

    const request: RequestWithUser = context.switchToHttp().getRequest();
    const user: JWTPayload = request.user;

    if (!user || !user.role || !requiredRoles.includes(user.role as Role)) {
      throw new ForbiddenException('Access denied');
    }

    return true;
  }
}
