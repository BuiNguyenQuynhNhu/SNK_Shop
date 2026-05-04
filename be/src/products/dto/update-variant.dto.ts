import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateVariantDto {
  @ApiPropertyOptional({ example: 'Black', description: 'Variant color' })
  color?: string;

  @ApiPropertyOptional({ example: 42, description: 'Shoe size (EU)' })
  size?: number;

  @ApiPropertyOptional({ example: 2500000, description: 'Price in VND' })
  price?: number;

  @ApiPropertyOptional({ example: 100, description: 'Stock quantity' })
  stock?: number;
}