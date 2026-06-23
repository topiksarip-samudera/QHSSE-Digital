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

    if (isPublic) return true;

    const request = context.switchToHttp().getRequest();
    const user = request.user;
    if (!user) throw new UnauthorizedException('Authentication required');

    // Resolve company ID from header, query, or user context
    let companyId =
      request.headers['x-company-id'] ||
      request.query.companyId ||
      user.primaryCompanyId ||
      user.companyId;

    // Attach company context to request
    if (companyId) {
      request.companyId = companyId;
      request.currentCompanyId = companyId;
      if (request.user) request.user.companyId = companyId;
    }

    // Super admin can access everything
    if (user.isSuperAdmin) return true;

    if (!companyId) throw new UnauthorizedException('Company context required');
    return true;
  }
}
