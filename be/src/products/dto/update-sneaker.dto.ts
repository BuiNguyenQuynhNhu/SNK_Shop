import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateSneakerDto {
  @ApiPropertyOptional({ example: 'Nike Air Max 95', description: 'Updated sneaker name' })
  name?: string;

  @ApiPropertyOptional({ example: 'Updated description', description: 'Updated sneaker description' })
  description?: string;

  @ApiPropertyOptional({ example: 2, description: 'Updated brand ID' })
  brandId?: number;
}