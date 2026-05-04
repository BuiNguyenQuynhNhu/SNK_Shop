import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'nguyenvana@example.com', description: 'User email address' })
  email!: string;

  @ApiProperty({ example: 'Password@123', description: 'User password' })
  password!: string;
}
