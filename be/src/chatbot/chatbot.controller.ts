import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse, ApiBody } from '@nestjs/swagger';
import { ChatbotService } from './chatbot.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { ChatMessageDto } from './dto/chat-message.dto';

@ApiTags('Chatbot')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('chatbot')
export class ChatbotController {
  constructor(private readonly chatbotService: ChatbotService) {}

  @Post()
  @ApiOperation({ summary: 'Send a message to the AI shopping chatbot' })
  @ApiBody({ type: ChatMessageDto })
  @ApiResponse({ status: 200, description: 'Chatbot reply with optional product recommendations' })
  async chat(@Req() req, @Body() body: ChatMessageDto) {
    const userId = req.user.userId;
    return this.chatbotService.handleChat(userId, body.message, body.history || []);
  }
}
