import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}

  async getCart(userId: number) {
    const customer = await this.prisma.customer.findUnique({
      where: { userId },
    });
    if (!customer) return null;
    return this.prisma.cart.findUnique({
      where: { customerId: customer.id },
      include: {
        items: {
          include: { variant: { include: { sneaker: { include: { brand: true } } } } },
        },
      },
    });
  }

  async addToCart(userId: number, variantId: number, quantity: number = 1) {
    const customer = await this.prisma.customer.findUnique({
      where: { userId },
    });
    if (!customer) throw new Error('Customer not found');
    // Ensure cart exists
    let cart = await this.prisma.cart.findUnique({
      where: { customerId: customer.id },
    });
    if (!cart) {
      cart = await this.prisma.cart.create({
        data: { customerId: customer.id },
      });
    }
    // Check if item exists
    const existing = await this.prisma.cartItem.findFirst({
      where: { cartId: cart.id, variantId },
    });
    if (existing) {
      return this.prisma.cartItem.update({
        where: { id: existing.id },
        data: { quantity: existing.quantity + quantity },
        include: { variant: true },
      });
    } else {
      return this.prisma.cartItem.create({
        data: {
          cartId: cart.id,
          variantId,
          quantity,
        },
        include: { variant: true },
      });
    }
  }

  async updateCartItem(userId: number, variantId: number, quantity: number) {
    const customer = await this.prisma.customer.findUnique({
      where: { userId },
    });
    if (!customer) throw new Error('Customer not found');
    const cart = await this.prisma.cart.findUnique({
      where: { customerId: customer.id },
    });
    if (!cart) throw new Error('Cart not found');
    if (quantity <= 0) {
      return this.prisma.cartItem.deleteMany({
        where: { cartId: cart.id, variantId },
      });
    }
    return this.prisma.cartItem.updateMany({
      where: { cartId: cart.id, variantId },
      data: { quantity },
    });
  }

  async removeFromCart(userId: number, variantId: number) {
    const customer = await this.prisma.customer.findUnique({
      where: { userId },
    });
    if (!customer) return;
    const cart = await this.prisma.cart.findUnique({
      where: { customerId: customer.id },
    });
    if (!cart) return;
    return this.prisma.cartItem.deleteMany({
      where: { cartId: cart.id, variantId },
    });
  }

  async clearCart(userId: number) {
    const customer = await this.prisma.customer.findUnique({
      where: { userId },
    });
    if (!customer) return;
    const cart = await this.prisma.cart.findUnique({
      where: { customerId: customer.id },
    });
    if (!cart) return;
    return this.prisma.cartItem.deleteMany({
      where: { cartId: cart.id },
    });
  }
}