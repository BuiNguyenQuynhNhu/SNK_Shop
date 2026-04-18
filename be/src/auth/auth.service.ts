import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import * as bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt'

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  async register(dto: any) {
    const hash = await bcrypt.hash(dto.password, 10)

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: hash,
        name: dto.name,
        phone: dto.phone,
      },
    })

    const customer = await this.prisma.customer.create({
      data: {
        userId: user.id,
      },
    })

    const token = this.jwt.sign({
      sub: user.id,
      email: user.email,
      role: 'CUSTOMER',
    })

    return {
      message: 'Register success',
      user: {
        ...user,
        customer,
      },
      access_token: token,
    }
  }

  async login(dto: any) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
      include: { employee: true, customer: true },
    })

    if (!user) throw new UnauthorizedException('Invalid email')

    const ok = await bcrypt.compare(dto.password, user.password)
    if (!ok) throw new UnauthorizedException('Wrong password')

    const role = user.employee?.role || 'CUSTOMER'

    const token = this.jwt.sign({
      sub: user.id,
      email: user.email,
      role,
    })

    return { access_token: token }
  }

  async me(userId: number) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      include: { employee: true, customer: true },
    })
  }

  async updateProfile(userId: number, dto: any) {
    return this.prisma.user.update({
      where: { id: userId },
      data: dto,
    })
  }

  async getAddresses(userId: number) {
    const customer = await this.prisma.customer.findUnique({
      where: { userId },
      include: { addresses: true },
    })
    return customer?.addresses || []
  }

  async addAddress(userId: number, dto: any) {
    const customer = await this.prisma.customer.findUnique({
      where: { userId },
    })
    if (!customer) throw new Error('Customer not found')
    return this.prisma.address.create({
      data: {
        ...dto,
        customerId: customer.id,
      },
    })
  }

  async updateAddress(userId: number, addressId: number, dto: any) {
    // Ensure the address belongs to the user
    const address = await this.prisma.address.findFirst({
      where: { id: addressId, customer: { userId } },
    })
    if (!address) throw new Error('Address not found')
    return this.prisma.address.update({
      where: { id: addressId },
      data: dto,
    })
  }

  async deleteAddress(userId: number, addressId: number) {
    const address = await this.prisma.address.findFirst({
      where: { id: addressId, customer: { userId } },
    })
    if (!address) throw new Error('Address not found')
    return this.prisma.address.delete({
      where: { id: addressId },
    })
  }
}