import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ChatMessageDto {
  @ApiProperty({ example: 'Tôi muốn tìm giày Nike size 42', description: 'User message to the chatbot' })
  message!: string;

  @ApiPropertyOptional({
    description: 'Chat history for context',
    example: [{ role: 'user', parts: [{ text: 'Hello' }] }],
  })
  history?: any[];
}
