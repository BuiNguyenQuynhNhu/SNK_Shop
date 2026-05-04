import { Controller, Get, Post, Body, Patch, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse, ApiBody } from '@nestjs/swagger';
import { OrderService } from './order.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/guards/roles.decorator.guard';
import { CurrentUser } from '../common/guards/current-user.decorator';
import { CreateOrderDto, UpdateOrderStatusDto } from './dto/order.dto';

@ApiTags('Orders')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @ApiOperation({ summary: 'Place a new order' })
  @ApiBody({ type: CreateOrderDto })
  @ApiResponse({ status: 201, description: 'Order placed successfully' })
  create(@CurrentUser() user, @Body() body: CreateOrderDto) {
    return this.orderService.create(
      user.userId,
      body.items,
      body.address,
      body.phone,
      body.paymentMethod,
      body.note,
    );
  }

  @Get()
  @ApiOperation({ summary: 'Get all orders (customers see only their own)' })
  @ApiResponse({ status: 200, description: 'List of orders' })
  findAll(@CurrentUser() user) {
    return this.orderService.findAll(user.role === 'CUSTOMER' ? user.userId : undefined);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single order by ID' })
  @ApiResponse({ status: 200, description: 'Order details' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  findOne(@Param('id') id: string, @CurrentUser() user) {
    return this.orderService.findOne(Number(id));
  }

  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'MANAGER')
  @Patch(':id/status')
  @ApiOperation({ summary: 'Update order status (Admin/Manager only)' })
  @ApiBody({ type: UpdateOrderStatusDto })
  @ApiResponse({ status: 200, description: 'Order status updated' })
  updateStatus(@Param('id') id: string, @Body() body: UpdateOrderStatusDto) {
    return this.orderService.updateStatus(Number(id), body.status);
  }
}
