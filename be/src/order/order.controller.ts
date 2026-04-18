import { Controller, Get, Post, Body, Patch, Param, UseGuards } from '@nestjs/common';
import { OrderService } from './order.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/guards/roles.decorator.guard';
import { CurrentUser } from '../common/guards/current-user.decorator';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@CurrentUser() user, @Body() body: any) {
    return this.orderService.create(user.userId, body.items, body.address, body.phone, body.paymentMethod, body.note);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@CurrentUser() user) {
    return this.orderService.findAll(user.role === 'CUSTOMER' ? user.userId : undefined);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user) {
    return this.orderService.findOne(Number(id));
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'MANAGER')
  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body() body: { status: string }) {
    return this.orderService.updateStatus(Number(id), body.status);
  }
}
