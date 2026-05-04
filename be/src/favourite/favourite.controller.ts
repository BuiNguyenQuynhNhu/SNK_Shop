import { Controller, Get, Post, Delete, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { FavouriteService } from './favourite.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/guards/current-user.decorator';

@ApiTags('Favourites')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('favourites')
export class FavouriteController {
  constructor(private readonly favouriteService: FavouriteService) {}

  @Get()
  @ApiOperation({ summary: 'Get all favourite sneakers for the current user' })
  @ApiResponse({ status: 200, description: 'List of favourite sneakers' })
  getFavourites(@CurrentUser() user) {
    return this.favouriteService.getFavourites(user.userId);
  }

  @Post(':sneakerId')
  @ApiOperation({ summary: 'Add a sneaker to favourites' })
  @ApiResponse({ status: 201, description: 'Sneaker added to favourites' })
  addToFavourite(@CurrentUser() user, @Param('sneakerId') sneakerId: string) {
    return this.favouriteService.addToFavourite(user.userId, Number(sneakerId));
  }

  @Delete(':sneakerId')
  @ApiOperation({ summary: 'Remove a sneaker from favourites' })
  @ApiResponse({ status: 200, description: 'Sneaker removed from favourites' })
  removeFromFavourite(@CurrentUser() user, @Param('sneakerId') sneakerId: string) {
    return this.favouriteService.removeFromFavourite(user.userId, Number(sneakerId));
  }
}