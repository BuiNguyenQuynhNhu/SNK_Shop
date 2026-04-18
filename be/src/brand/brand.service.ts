import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';

@Injectable()
export class BrandService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateBrandDto) {
    return this.prisma.brand.create({
      data: dto,
    });
  }

  async findAll() {
    return this.prisma.brand.findMany({
      include: {
        logo: true,
        image: true,
        sneakers: true,
      },
    });
  }

  async findOne(id: number) {
    return this.prisma.brand.findUnique({
      where: { id },
      include: {
        logo: true,
        image: true,
        sneakers: true,
      },
    });
  }

  async update(id: number, dto: UpdateBrandDto) {
    return this.prisma.brand.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: number) {
    return this.prisma.brand.delete({
      where: { id },
    });
  }
}