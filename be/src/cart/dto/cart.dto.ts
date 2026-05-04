import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CartItemDto {
  @ApiProperty({ example: 3, description: 'Variant ID to add to cart' })
  variantId!: number;

  @ApiPropertyOptional({ example: 2, description: 'Quantity (defaults to 1)' })
  quantity?: number;
}

export class UpdateCartItemDto {
  @ApiProperty({ example: 3, description: 'Variant ID of the item to update' })
  variantId!: number;

  @ApiProperty({ example: 5, description: 'New quantity (0 removes the item)' })
  quantity!: number;
}
