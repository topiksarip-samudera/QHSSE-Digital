import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../../auth/decorators/public.decorator';

@Injectable()
export class TenantGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new UnauthorizedException('Authentication required');
    }

    // Super admin can access everything (but still gets logged)
    if (user.isSuperAdmin) {
      return true;
    }

    // Company ID is required for non-super-admin users
    // It can come from header, query, or user's primary company
    const companyId =
      request.headers['x-company-id'] ||
      request.query.companyId ||
      user.primaryCompanyId;

    if (!companyId) {
      throw new UnauthorizedException('Company context required');
    }

    // Attach company context to request
    request.companyId = companyId;
    request.currentCompanyId = companyId;
    if (request.user) {
      request.user.companyId = companyId;
    }

    return true;
  }
}
