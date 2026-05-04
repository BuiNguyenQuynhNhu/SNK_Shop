import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse, ApiBody } from '@nestjs/swagger';
import { BrandService } from './brand.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/guards/roles.decorator.guard';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';

@ApiTags('Brands')
@Controller('brands')
export class BrandController {
  constructor(private readonly brandService: BrandService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  @Roles('ADMIN', 'MANAGER')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Create a new brand (Admin/Manager only)' })
  @ApiBody({ type: CreateBrandDto })
  @ApiResponse({ status: 201, description: 'Brand created successfully' })
  create(@Body() createBrandDto: CreateBrandDto) {
    return this.brandService.create(createBrandDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all brands' })
  @ApiResponse({ status: 200, description: 'List of all brands' })
  findAll() {
    return this.brandService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single brand by ID' })
  @ApiResponse({ status: 200, description: 'Brand details' })
  @ApiResponse({ status: 404, description: 'Brand not found' })
  findOne(@Param('id') id: string) {
    return this.brandService.findOne(Number(id));
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch(':id')
  @Roles('ADMIN', 'MANAGER')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Update a brand (Admin/Manager only)' })
  @ApiBody({ type: UpdateBrandDto })
  @ApiResponse({ status: 200, description: 'Brand updated successfully' })
  update(@Param('id') id: string, @Body() updateBrandDto: UpdateBrandDto) {
    return this.brandService.update(Number(id), updateBrandDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':id')
  @Roles('ADMIN', 'MANAGER')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Delete a brand (Admin/Manager only)' })
  @ApiResponse({ status: 200, description: 'Brand deleted successfully' })
  remove(@Param('id') id: string) {
    return this.brandService.remove(Number(id));
  }
}