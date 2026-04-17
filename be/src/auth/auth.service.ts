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

    return {
      message: 'Register success',
      user,
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

    const role =
      user.employee?.position ||
      'CUSTOMER'

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
}