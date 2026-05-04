import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'nguyenvana@example.com', description: 'User email address' })
  email!: string;

  @ApiProperty({ example: 'Password@123', description: 'User password (min 6 chars)' })
  password!: string;

  @ApiProperty({ example: 'Nguyễn Văn A', description: 'Full name' })
  name!: string;
}
