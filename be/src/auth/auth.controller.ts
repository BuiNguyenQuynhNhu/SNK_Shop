import { Body, Controller, Get, Post, Req, UseGuards, Patch, Param, Delete } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse, ApiBody } from '@nestjs/swagger'
import { AuthService } from './auth.service'
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard'
import { CurrentUser } from '../common/guards/current-user.decorator'
import { RegisterDto } from './dto/register.dto'
import { LoginDto } from './dto/login.dto'
import { UpdateProfileDto, AddressDto } from './dto/profile.dto'

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private auth: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user account' })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({ status: 201, description: 'User registered successfully' })
  register(@Body() body: RegisterDto) {
    return this.auth.register(body)
  }

  @Post('login')
  @ApiOperation({ summary: 'Login and receive a JWT access token' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: 200, description: 'Login successful, returns access_token' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  login(@Body() body: LoginDto) {
    return this.auth.login(body)
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get current authenticated user info' })
  @ApiResponse({ status: 200, description: 'Current user profile' })
  me(@Req() req: any) {
    return this.auth.me(req.user.userId)
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Logout current user (client-side token invalidation)' })
  @ApiResponse({ status: 200, description: 'Logged out successfully' })
  logout() {
    return { message: 'Logged out successfully' }
  }

  @UseGuards(JwtAuthGuard)
  @Patch('profile')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Update current user profile' })
  @ApiBody({ type: UpdateProfileDto })
  @ApiResponse({ status: 200, description: 'Profile updated successfully' })
  updateProfile(@CurrentUser() user, @Body() body: UpdateProfileDto) {
    return this.auth.updateProfile(user.userId, body)
  }

  @UseGuards(JwtAuthGuard)
  @Get('addresses')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get all addresses for the current user' })
  @ApiResponse({ status: 200, description: 'List of addresses' })
  getAddresses(@CurrentUser() user) {
    return this.auth.getAddresses(user.userId)
  }

  @UseGuards(JwtAuthGuard)
  @Post('addresses')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Add a new delivery address' })
  @ApiBody({ type: AddressDto })
  @ApiResponse({ status: 201, description: 'Address added successfully' })
  addAddress(@CurrentUser() user, @Body() body: AddressDto) {
    return this.auth.addAddress(user.userId, body)
  }

  @UseGuards(JwtAuthGuard)
  @Patch('addresses/:id')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Update an existing delivery address' })
  @ApiBody({ type: AddressDto })
  @ApiResponse({ status: 200, description: 'Address updated successfully' })
  updateAddress(@CurrentUser() user, @Body() body: AddressDto, @Param('id') id: string) {
    return this.auth.updateAddress(user.userId, Number(id), body)
  }

  @UseGuards(JwtAuthGuard)
  @Delete('addresses/:id')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Delete a delivery address' })
  @ApiResponse({ status: 200, description: 'Address deleted successfully' })
  deleteAddress(@CurrentUser() user, @Param('id') id: string) {
    return this.auth.deleteAddress(user.userId, Number(id))
  }
}