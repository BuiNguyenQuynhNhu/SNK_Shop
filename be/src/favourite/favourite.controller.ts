import { Controller, Get, Post, Delete, Param, UseGuards } from '@nestjs/common';
import { FavouriteService } from './favourite.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/guards/current-user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('favourites')
export class FavouriteController {
  constructor(private readonly favouriteService: FavouriteService) {}

  @Get()
  getFavourites(@CurrentUser() user) {
    return this.favouriteService.getFavourites(user.userId);
  }

  @Post(':sneakerId')
  addToFavourite(@CurrentUser() user, @Param('sneakerId') sneakerId: string) {
    return this.favouriteService.addToFavourite(user.userId, Number(sneakerId));
  }

  @Delete(':sneakerId')
  removeFromFavourite(@CurrentUser() user, @Param('sneakerId') sneakerId: string) {
    return this.favouriteService.removeFromFavourite(user.userId, Number(sneakerId));
  }
}