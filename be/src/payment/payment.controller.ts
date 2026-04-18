import { Controller, Get, Post, Patch, Param, Body, UseGuards } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/guards/roles.decorator.guard';

@UseGuards(JwtAuthGuard)
@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Get('order/:orderId')
  getPayment(@Param('orderId') orderId: string) {
    return this.paymentService.getPayment(Number(orderId));
  }

  @Post('order/:orderId')
  processPayment(@Param('orderId') orderId: string, @Body() body: { method: string }) {
    return this.paymentService.processPayment(Number(orderId), body.method);
  }

  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'MANAGER')
  @Patch('order/:orderId/status')
  updatePaymentStatus(
    @Param('orderId') orderId: string,
    @Body() body: { status: string; transactionId?: string }
  ) {
    return this.paymentService.updatePaymentStatus(Number(orderId), body.status, body.transactionId);
  }
}