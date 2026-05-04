import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ProcessPaymentDto {
  @ApiProperty({ example: 'COD', description: 'Payment method (COD, BANK_TRANSFER, MOMO, etc.)' })
  method!: string;
}

export class UpdatePaymentStatusDto {
  @ApiProperty({ example: 'COMPLETED', description: 'Payment status (PENDING, COMPLETED, FAILED, REFUNDED)' })
  status!: string;

  @ApiPropertyOptional({ example: 'TXN-20240504-001', description: 'Transaction ID from payment provider' })
  transactionId?: string;
}
