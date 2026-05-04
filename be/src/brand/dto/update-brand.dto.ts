import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateBrandDto {
  @ApiPropertyOptional({ example: 'Adidas', description: 'Updated brand name' })
  name?: string;

  @ApiPropertyOptional({ example: 'German multinational corporation', description: 'Updated brand description' })
  description?: string;

  @ApiPropertyOptional({ example: 7, description: 'Media ID for updated brand logo' })
  logoId?: number;

  @ApiPropertyOptional({ example: 8, description: 'Media ID for updated brand banner image' })
  imageId?: number;
}