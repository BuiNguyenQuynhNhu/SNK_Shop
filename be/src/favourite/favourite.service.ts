import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FavouriteService {
  constructor(private prisma: PrismaService) {}

  async addToFavourite(userId: number, sneakerId: number) {
    const customer = await this.prisma.customer.findUnique({
      where: { userId },
    });
    if (!customer) throw new Error('Customer not found');
    // Ensure favourite exists for customer
    let favourite = await this.prisma.favourite.findUnique({
      where: { customerId: customer.id },
    });
    if (!favourite) {
      favourite = await this.prisma.favourite.create({
        data: { customerId: customer.id },
      });
    }
    // Add item if not exists
    const existing = await this.prisma.favouriteItem.findFirst({
      where: { favouriteId: favourite.id, sneakerId },
    });
    if (!existing) {
      return this.prisma.favouriteItem.create({
        data: {
          favouriteId: favourite.id,
          sneakerId,
        },
        include: { sneaker: true },
      });
    }
    return existing;
  }

  async removeFromFavourite(userId: number, sneakerId: number) {
    const customer = await this.prisma.customer.findUnique({
      where: { userId },
    });
    if (!customer) return;
    const favourite = await this.prisma.favourite.findUnique({
      where: { customerId: customer.id },
    });
    if (!favourite) return;
    return this.prisma.favouriteItem.deleteMany({
      where: { favouriteId: favourite.id, sneakerId },
    });
  }

  async getFavourites(userId: number) {
    const customer = await this.prisma.customer.findUnique({
      where: { userId },
    });
    if (!customer) return null;
    return this.prisma.favourite.findUnique({
      where: { customerId: customer.id },
      include: {
        items: {
          include: { sneaker: { include: { brand: true, variants: true } } },
        },
      },
    });
  }
}