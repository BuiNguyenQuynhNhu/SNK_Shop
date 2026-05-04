import { Controller, Get, Post, Patch, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse, ApiBody } from '@nestjs/swagger';
import { PaymentService } from './payment.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/guards/roles.decorator.guard';
import { ProcessPaymentDto, UpdatePaymentStatusDto } from './dto/payment.dto';

@ApiTags('Payments')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Get('order/:orderId')
  @ApiOperation({ summary: 'Get payment info for a specific order' })
  @ApiResponse({ status: 200, description: 'Payment details' })
  @ApiResponse({ status: 404, description: 'Payment not found' })
  getPayment(@Param('orderId') orderId: string) {
    return this.paymentService.getPayment(Number(orderId));
  }

  @Post('order/:orderId')
  @ApiOperation({ summary: 'Process payment for an order' })
  @ApiBody({ type: ProcessPaymentDto })
  @ApiResponse({ status: 201, description: 'Payment processed successfully' })
  processPayment(@Param('orderId') orderId: string, @Body() body: ProcessPaymentDto) {
    return this.paymentService.processPayment(Number(orderId), body.method);
  }

  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'MANAGER')
  @Patch('order/:orderId/status')
  @ApiOperation({ summary: 'Update payment status (Admin/Manager only)' })
  @ApiBody({ type: UpdatePaymentStatusDto })
  @ApiResponse({ status: 200, description: 'Payment status updated' })
  updatePaymentStatus(
    @Param('orderId') orderId: string,
    @Body() body: UpdatePaymentStatusDto,
  ) {
    return this.paymentService.updatePaymentStatus(Number(orderId), body.status, body.transactionId);
  }
}