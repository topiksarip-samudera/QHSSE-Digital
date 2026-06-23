import { Controller, Get, Post, Patch, Delete, Param, Body, Query, Request, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RequiredPermissions } from '../auth/guards/permissions.guard';
import { SubscriptionService } from './subscription.service';
import { CreatePlanDto, UpdateSubscriptionDto, PlanQueryDto } from './dto/subscription.dto';

@ApiTags('Subscription & Billing') @ApiBearerAuth() @Controller()
export class SubscriptionController {
  constructor(private readonly svc: SubscriptionService) {}

  @Post('plans') @RequiredPermissions('subscription-billing-package-management.create') @ApiOperation({ summary: 'Create plan' })
  async createPlan(@Body() dto: CreatePlanDto) { return this.svc.createPlan(dto); }
  @Get('plans') @RequiredPermissions('subscription-billing-package-management.view') @ApiOperation({ summary: 'List plans' })
  async getPlans(@Query() q: PlanQueryDto) { return this.svc.getPlans(q); }
  @Get('plans/:id') @RequiredPermissions('subscription-billing-package-management.view') @ApiOperation({ summary: 'Get plan' })
  async getPlan(@Param('id') id: string) { return this.svc.getPlan(id); }
  @Patch('plans/:id') @RequiredPermissions('subscription-billing-package-management.update') @ApiOperation({ summary: 'Update plan' })
  async updatePlan(@Param('id') id: string, @Body() d: any) { return this.svc.updatePlan(id, d); }
  @Delete('plans/:id') @RequiredPermissions('subscription-billing-package-management.delete') @ApiOperation({ summary: 'Delete plan' })
  async deletePlan(@Param('id') id: string) { return this.svc.deletePlan(id); }

  @Get('subscriptions/:companyId') @RequiredPermissions('subscription-billing-package-management.view') @ApiOperation({ summary: 'Get company subscription' })
  async getSubscription(@Param('companyId') companyId: string) { return this.svc.getSubscription(companyId); }
  @Patch('subscriptions/:companyId') @RequiredPermissions('subscription-billing-package-management.update') @ApiOperation({ summary: 'Update subscription' })
  async updateSubscription(@Param('companyId') companyId: string, @Body() dto: UpdateSubscriptionDto) { return this.svc.updateSubscription(companyId, dto); }

  @Get('billing/usage') @RequiredPermissions('subscription-billing-package-management.view') @ApiOperation({ summary: 'Get usage' })
  async getUsage(@Request() req: any) { return this.svc.getUsage(req.user.companyId); }
  @Get('invoices') @RequiredPermissions('subscription-billing-package-management.view') @ApiOperation({ summary: 'Get invoices' })
  async getInvoices(@Request() req: any) { return this.svc.getInvoices(req.user.companyId); }
}
