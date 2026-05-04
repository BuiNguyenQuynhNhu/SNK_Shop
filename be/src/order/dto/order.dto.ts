import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class OrderItemDto {
  @ApiProperty({ example: 3, description: 'Variant ID' })
  variantId!: number;

  @ApiProperty({ example: 2, description: 'Quantity' })
  quantity!: number;
}

export class CreateOrderDto {
  @ApiProperty({ type: [OrderItemDto], description: 'List of items in the order' })
  items!: OrderItemDto[];

  @ApiProperty({ example: '123 Nguyễn Trãi, Hà Nội', description: 'Delivery address' })
  address!: string;

  @ApiProperty({ example: '0912345678', description: 'Contact phone number' })
  phone!: string;

  @ApiProperty({ example: 'COD', description: 'Payment method (COD, BANK_TRANSFER, etc.)' })
  paymentMethod!: string;

  @ApiPropertyOptional({ example: 'Please leave at the door', description: 'Order note' })
  note?: string;
}

export class UpdateOrderStatusDto {
  @ApiProperty({ example: 'CONFIRMED', description: 'New order status (PENDING, CONFIRMED, SHIPPED, DELIVERED, CANCELLED)' })
  status!: string;
}
