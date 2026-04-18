import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PaymentService {
  constructor(private prisma: PrismaService) {}

  async createPayment(orderId: number, method: string, amount: number) {
    return this.prisma.payment.create({
      data: {
        orderId,
        method: method as any,
        amount,
        status: 'PENDING' as any,
      } as any,
    });
  }

  async getPayment(orderId: number) {
    return this.prisma.payment.findUnique({
      where: { orderId },
    });
  }

  async updatePaymentStatus(orderId: number, status: string, transactionId?: string) {
    return this.prisma.payment.update({
      where: { orderId },
      data: {
        status: status as any,
        transactionId,
      },
    });
  }

  async processPayment(orderId: number, method: string) {
    // Basic processing - in real app, integrate with payment gateway
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { payment: true },
    });
    if (!order) throw new Error('Order not found');
    if (order.payment) throw new Error('Payment already exists');

    // Create payment
    const payment = await this.createPayment(orderId, method, order.totalAmount);

    // Simulate processing based on method
    let status = 'PENDING';
    if (method === 'COD') {
      status = 'PAID'; // COD is considered paid on delivery
    } else {
      // For online payments, would redirect to gateway
      status = 'PENDING';
    }

    return this.updatePaymentStatus(orderId, status);
  }
}