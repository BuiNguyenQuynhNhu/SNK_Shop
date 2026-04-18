import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSneakerDto } from './dto/create-sneaker.dto';
import { UpdateSneakerDto } from './dto/update-sneaker.dto';
import { UpdateVariantDto } from './dto/update-variant.dto';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateSneakerDto, userId: number) {
    return this.prisma.sneaker.create({
      data: {
        ...dto,
        createdById: userId,
      },
    });
  }

  async update(id: number, dto: UpdateSneakerDto, userId: number) {
    return this.prisma.sneaker.update({
      where: { id },
      data: {
        ...dto,
        updatedById: userId,
      },
    });
  }

  async updateVariant(id: number, dto: UpdateVariantDto, userId: number) {
    return this.prisma.variant.update({
      where: { id },
      data: dto,
    });
  }

  async findAll(query: any) {
    const { page = 1, limit = 10 } = query;

    return this.prisma.sneaker.findMany({
      skip: (page - 1) * limit,
      take: Number(limit),
      include: {
        brand: true,
        variants: true,
      },
    });
  }

  async findOne(id: number) {
    return this.prisma.sneaker.findUnique({
      where: { id },
      include: {
        brand: true,
        variants: {
          include: {
            image: true,
          },
        },
      },
    });
  }
}