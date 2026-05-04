import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse, ApiBody } from '@nestjs/swagger';
import { CartService } from './cart.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/guards/current-user.decorator';
import { CartItemDto, UpdateCartItemDto } from './dto/cart.dto';

@ApiTags('Cart')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  @ApiOperation({ summary: 'Get the current user\'s cart' })
  @ApiResponse({ status: 200, description: 'Cart contents' })
  getCart(@CurrentUser() user) {
    return this.cartService.getCart(user.userId);
  }

  @Post()
  @ApiOperation({ summary: 'Add an item to the cart' })
  @ApiBody({ type: CartItemDto })
  @ApiResponse({ status: 201, description: 'Item added to cart' })
  addToCart(@CurrentUser() user, @Body() body: CartItemDto) {
    return this.cartService.addToCart(user.userId, body.variantId, body.quantity || 1);
  }

  @Patch()
  @ApiOperation({ summary: 'Update quantity of a cart item' })
  @ApiBody({ type: UpdateCartItemDto })
  @ApiResponse({ status: 200, description: 'Cart item updated' })
  updateCartItem(@CurrentUser() user, @Body() body: UpdateCartItemDto) {
    return this.cartService.updateCartItem(user.userId, body.variantId, body.quantity);
  }

  @Delete(':variantId')
  @ApiOperation({ summary: 'Remove a specific item from the cart' })
  @ApiResponse({ status: 200, description: 'Item removed from cart' })
  removeFromCart(@CurrentUser() user, @Param('variantId') variantId: string) {
    return this.cartService.removeFromCart(user.userId, Number(variantId));
  }

  @Delete()
  @ApiOperation({ summary: 'Clear the entire cart' })
  @ApiResponse({ status: 200, description: 'Cart cleared' })
  clearCart(@CurrentUser() user) {
    return this.cartService.clearCart(user.userId);
  }
}