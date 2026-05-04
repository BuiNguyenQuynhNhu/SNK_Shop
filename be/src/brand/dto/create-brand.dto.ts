import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateBrandDto {
  @ApiProperty({ example: 'Nike', description: 'Brand name' })
  name!: string;

  @ApiPropertyOptional({ example: 'American multinational footwear company', description: 'Brand description' })
  description?: string;

  @ApiPropertyOptional({ example: 5, description: 'Media ID for brand logo' })
  logoId?: number;

  @ApiPropertyOptional({ example: 6, description: 'Media ID for brand banner image' })
  imageId?: number;
}