import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { CartService } from './cart.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/guards/current-user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  getCart(@CurrentUser() user) {
    return this.cartService.getCart(user.userId);
  }

  @Post()
  addToCart(@CurrentUser() user, @Body() body: { variantId: number; quantity?: number }) {
    return this.cartService.addToCart(user.userId, body.variantId, body.quantity || 1);
  }

  @Patch()
  updateCartItem(@CurrentUser() user, @Body() body: { variantId: number; quantity: number }) {
    return this.cartService.updateCartItem(user.userId, body.variantId, body.quantity);
  }

  @Delete(':variantId')
  removeFromCart(@CurrentUser() user, @Param('variantId') variantId: string) {
    return this.cartService.removeFromCart(user.userId, Number(variantId));
  }

  @Delete()
  clearCart(@CurrentUser() user) {
    return this.cartService.clearCart(user.userId);
  }
}