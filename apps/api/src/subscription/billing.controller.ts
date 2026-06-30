import { Controller, Get, Post, Patch, Body, Param, Query, Request, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RequiredPermissions } from '../auth/guards/permissions.guard';
import { SubscriptionService } from './subscription.service';

@ApiTags('SaaS Billing') @ApiBearerAuth() @Controller('billing')
export class BillingController {
  constructor(private readonly svc: SubscriptionService) {}

  @Post('checkout') @RequiredPermissions('tenant.subscription.change') @ApiOperation({ summary: 'Initiate plan checkout' })
  async checkout(@Body() d: { planId: string; paymentMethod?: string }, @Request() req: any) { return this.svc.checkout(req.user.companyId, d.planId, req.user.id, d.paymentMethod); }

  @Post('webhook') @HttpCode(HttpStatus.OK) @ApiOperation({ summary: 'Payment gateway webhook' })
  async webhook(@Body() d: any, @Query('gateway') gateway: string) { return this.svc.handleWebhook(gateway, d); }

  @Post('subscriptions/:companyId/cancel') @RequiredPermissions('tenant.subscription.change') @HttpCode(HttpStatus.OK) @ApiOperation({ summary: 'Cancel subscription' })
  async cancel(@Param('companyId') companyId: string, @Request() req: any) { return this.svc.cancelSubscription(companyId); }

  @Post('subscriptions/:companyId/trial') @RequiredPermissions('tenant.subscription.change') @ApiOperation({ summary: 'Start free trial' })
  async startTrial(@Param('companyId') companyId: string, @Body() d: { planId: string; trialDays?: number }, @Request() req: any) { return this.svc.startTrial(companyId, d.planId, d.trialDays || 14); }

  @Get('subscriptions/:companyId/status') @RequiredPermissions('tenant.subscription.view') @ApiOperation({ summary: 'Get subscription status with trial info' })
  async subscriptionStatus(@Param('companyId') companyId: string, @Request() req: any) { return this.svc.getSubscriptionStatus(companyId); }

  @Get('invoices') @RequiredPermissions('tenant.invoice.view') @ApiOperation({ summary: 'List invoices' })
  async invoices(@Request() req: any, @Query() q: any) { return this.svc.findAllInvoices(req.user.companyId, q); }

  @Get('invoices/:id') @RequiredPermissions('tenant.invoice.view') @ApiOperation({ summary: 'Get invoice detail' })
  async invoiceDetail(@Param('id') id: string, @Request() req: any) { return this.svc.findInvoice(id, req.user.companyId); }
}
