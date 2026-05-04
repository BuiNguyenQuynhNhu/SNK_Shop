import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiPropertyOptional({ example: 'Nguyễn Văn A', description: 'Full name' })
  name?: string;

  @ApiPropertyOptional({ example: '0912345678', description: 'Phone number' })
  phone?: string;
}