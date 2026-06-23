import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { PrismaService } from '../../prisma/prisma.service';
import { IS_PUBLIC_KEY } from '../../auth/decorators/public.decorator';

const AUDITABLE_METHODS = ['POST', 'PATCH', 'PUT', 'DELETE'];

@Injectable()
export class AuditLogInterceptor implements NestInterceptor {
  private readonly logger = new Logger(AuditLogInterceptor.name);

  constructor(
    private readonly reflector: Reflector,
    private readonly prisma: PrismaService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const method = request.method;
    const user = request.user;

    // Only audit mutating operations with authenticated users
    if (!AUDITABLE_METHODS.includes(method) || !user) {
      return next.handle();
    }

    const startTime = Date.now();

    return next.handle().pipe(
      tap({
        next: async (responseData) => {
          try {
            const action = this.getActionFromMethod(method);
            const path = request.url;
            const module = this.extractModule(path);

            await this.prisma.auditLog.create({
              data: {
                companyId: request.companyId || request.currentCompanyId,
                actorId: user.sub,
                module,
                action,
                recordType: this.extractResource(path),
                recordId: responseData?.data?.id || responseData?.id || request.params?.id,
                newValue: responseData?.data || responseData,
                ipAddress: request.ip,
                userAgent: request.headers['user-agent'],
                metadata: {
                  method,
                  path,
                  duration: Date.now() - startTime,
                },
              },
            });
          } catch (error) {
            // Don't let audit logging failures break the request
            this.logger.error(`Audit log failed: ${error}`);
          }
        },
        error: () => {},
      }),
    );
  }

  private getActionFromMethod(method: string): string {
    const mapping: Record<string, string> = {
      POST: 'create',
      PATCH: 'update',
      PUT: 'update',
      DELETE: 'delete',
    };
    return mapping[method] || 'unknown';
  }

  private extractModule(path: string): string {
    // /api/v1/companies/123 -> companies
    const segments = path.split('/').filter(Boolean);
    // Remove 'api' and 'v1' prefix
    return segments.length >= 3 ? segments[2] : segments[0] || 'unknown';
  }

  private extractResource(path: string): string {
    const segments = path.split('/').filter(Boolean);
    return segments.length >= 3 ? segments[2] : segments[0] || 'unknown';
  }
}
