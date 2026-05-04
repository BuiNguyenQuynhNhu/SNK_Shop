import { ApiProperty } from '@nestjs/swagger';

export class CreateSneakerDto {
  @ApiProperty({ example: 'Nike Air Max 90', description: 'Sneaker name' })
  name!: string;

  @ApiProperty({ example: 'Classic running shoe with visible Air cushioning', description: 'Sneaker description' })
  description!: string;

  @ApiProperty({ example: 1, description: 'Brand ID' })
  brandId!: number;

  @ApiProperty({ example: 2, description: 'Category ID' })
  categoryId!: number;
}