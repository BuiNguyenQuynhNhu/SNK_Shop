import { Body, Controller, Get, Post, Req, UseGuards, Patch, Param, Delete } from '@nestjs/common'
import { AuthService } from './auth.service'
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard'
import { CurrentUser } from '../common/guards/current-user.decorator'

@Controller('auth')
export class AuthController {
  constructor(private auth: AuthService) {}

  @Post('register')
  register(@Body() body: any) {
    return this.auth.register(body)
  }

  @Post('login')
  login(@Body() body: any) {
    return this.auth.login(body)
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  me(@Req() req: any) {
    return this.auth.me(req.user.userId)
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  logout() {
    return { message: 'Logged out successfully' }
  }

  @UseGuards(JwtAuthGuard)
  @Patch('profile')
  updateProfile(@CurrentUser() user, @Body() body: any) {
    return this.auth.updateProfile(user.userId, body)
  }

  @UseGuards(JwtAuthGuard)
  @Get('addresses')
  getAddresses(@CurrentUser() user) {
    return this.auth.getAddresses(user.userId)
  }

  @UseGuards(JwtAuthGuard)
  @Post('addresses')
  addAddress(@CurrentUser() user, @Body() body: any) {
    return this.auth.addAddress(user.userId, body)
  }

  @UseGuards(JwtAuthGuard)
  @Patch('addresses/:id')
  updateAddress(@CurrentUser() user, @Body() body: any, @Param('id') id: string) {
    return this.auth.updateAddress(user.userId, Number(id), body)
  }

  @UseGuards(JwtAuthGuard)
  @Delete('addresses/:id')
  deleteAddress(@CurrentUser() user, @Param('id') id: string) {
    return this.auth.deleteAddress(user.userId, Number(id))
  }
}