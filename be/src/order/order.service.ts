import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class OrderService {
  constructor(private prisma: PrismaService) {}

  async create(userId: number, items: any[], address: string, phone: string, paymentMethod: string, note?: string) {
    const customer = await this.prisma.customer.findUnique({
      where: { userId },
    });
    if (!customer) throw new Error('Customer not found');

    const orderItems = await Promise.all(
      items.map(async (item) => {
        const variant = await this.prisma.variant.findUnique({
          where: { id: item.variantId },
          include: { sneaker: true },
        });
        if (!variant) throw new Error('Variant not found');
        return {
          variantId: item.variantId,
          quantity: item.quantity,
          price: variant.price,
          total: Number(variant.price) * item.quantity,
          name: variant.sneaker.name,
          color: variant.color,
          size: variant.size,
        };
      })
    );

    const totalAmount = orderItems.reduce((sum, item) => sum + item.total, 0);

    return this.prisma.order.create({
      data: {
        customerId: customer.id,
        address,
        phone,
        note,
        paymentMethod: paymentMethod as any,
        totalAmount,
        finalAmount: totalAmount,
        items: {
          create: orderItems,
        },
      },
      include: { items: { include: { variant: true } } },
    });
  }

  async findAll(customerId?: number) {
    return this.prisma.order.findMany({
      where: customerId ? { customerId } : {},
      include: { items: { include: { variant: true } }, customer: true },
    });
  }

  async findOne(id: number) {
    return this.prisma.order.findUnique({
      where: { id },
      include: { items: { include: { variant: true } }, customer: true },
    });
  }

  async updateStatus(id: number, status: string) {
    return this.prisma.order.update({
      where: { id },
      data: { status: status as any },
    });
  }
}
