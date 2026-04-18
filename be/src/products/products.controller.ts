import { Controller, Get, Post, Body, Patch, Param, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/guards/roles.decorator.guard';
import { CurrentUser } from '../common/guards/current-user.decorator';
import { ProductsService } from './products.service';
import { CreateSneakerDto } from './dto/create-sneaker.dto';
import { UpdateSneakerDto } from './dto/update-sneaker.dto';
import { UpdateVariantDto } from './dto/update-variant.dto';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('products')
export class ProductsController {
  constructor(private service: ProductsService) {}

  @Post()
  @Roles('ADMIN', 'MANAGER')
  create(
    @Body() dto: CreateSneakerDto,
    @CurrentUser() user,
  ) {
    return this.service.create(dto, user.id);
  }

  @Get()
  findAll(@Query() query) {
    return this.service.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(Number(id));
  }

  @Patch(':id')
  @Roles('ADMIN', 'MANAGER')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateSneakerDto,
    @CurrentUser() user,
  ) {
    return this.service.update(Number(id), dto, user.id);
  }

  @Patch('variants/:id')
  @Roles('ADMIN', 'MANAGER')
  updateVariant(
    @Param('id') id: string,
    @Body() dto: UpdateVariantDto,
    @CurrentUser() user,
  ) {
    return this.service.updateVariant(Number(id), dto, user.id);
  }
}