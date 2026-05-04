import { Controller, Get, Post, Body, Patch, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse, ApiBody, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/guards/roles.decorator.guard';
import { CurrentUser } from '../common/guards/current-user.decorator';
import { ProductsService } from './products.service';
import { CreateSneakerDto } from './dto/create-sneaker.dto';
import { UpdateSneakerDto } from './dto/update-sneaker.dto';
import { UpdateVariantDto } from './dto/update-variant.dto';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private service: ProductsService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  @Roles('ADMIN', 'MANAGER')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Create a new sneaker (Admin/Manager only)' })
  @ApiBody({ type: CreateSneakerDto })
  @ApiResponse({ status: 201, description: 'Sneaker created successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden – insufficient role' })
  create(
    @Body() dto: CreateSneakerDto,
    @CurrentUser() user,
  ) {
    return this.service.create(dto, user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all sneakers (supports filtering via query params)' })
  @ApiQuery({ name: 'brandId', required: false, type: Number, description: 'Filter by brand ID' })
  @ApiQuery({ name: 'categoryId', required: false, type: Number, description: 'Filter by category ID' })
  @ApiQuery({ name: 'search', required: false, type: String, description: 'Search by name' })
  @ApiResponse({ status: 200, description: 'List of sneakers' })
  findAll(@Query() query) {
    return this.service.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single sneaker by ID' })
  @ApiResponse({ status: 200, description: 'Sneaker details' })
  @ApiResponse({ status: 404, description: 'Sneaker not found' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(Number(id));
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch(':id')
  @Roles('ADMIN', 'MANAGER')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Update a sneaker (Admin/Manager only)' })
  @ApiBody({ type: UpdateSneakerDto })
  @ApiResponse({ status: 200, description: 'Sneaker updated successfully' })
  update(
    @Param('id') id: string,
    @Body() dto: UpdateSneakerDto,
    @CurrentUser() user,
  ) {
    return this.service.update(Number(id), dto, user.id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch('variants/:id')
  @Roles('ADMIN', 'MANAGER')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Update a sneaker variant (Admin/Manager only)' })
  @ApiBody({ type: UpdateVariantDto })
  @ApiResponse({ status: 200, description: 'Variant updated successfully' })
  updateVariant(
    @Param('id') id: string,
    @Body() dto: UpdateVariantDto,
    @CurrentUser() user,
  ) {
    return this.service.updateVariant(Number(id), dto, user.id);
  }
}