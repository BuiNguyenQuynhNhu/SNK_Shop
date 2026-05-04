import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateProfileDto {
  @ApiPropertyOptional({ example: 'Nguyễn Văn B', description: 'Updated full name' })
  name?: string;

  @ApiPropertyOptional({ example: '0987654321', description: 'Updated phone number' })
  phone?: string;

  @ApiPropertyOptional({ example: 10, description: 'Media ID for avatar image' })
  avatarId?: number;
}

export class AddressDto {
  @ApiProperty({ example: '123 Nguyễn Trãi', description: 'Street address' })
  street!: string;

  @ApiProperty({ example: 'Hà Nội', description: 'City' })
  city!: string;

  @ApiPropertyOptional({ example: 'Quận 1', description: 'District' })
  district?: string;

  @ApiPropertyOptional({ example: 'true', description: 'Set as default address' })
  isDefault?: boolean;
}
