import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
<<<<<<< HEAD
import { ChatbotService } from './chatbot.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

=======
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse, ApiBody } from '@nestjs/swagger';
import { ChatbotService } from './chatbot.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { ChatMessageDto } from './dto/chat-message.dto';

@ApiTags('Chatbot')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
>>>>>>> 7dc2704 (add some dto)
@Controller('chatbot')
export class ChatbotController {
  constructor(private readonly chatbotService: ChatbotService) {}

<<<<<<< HEAD
  @UseGuards(JwtAuthGuard)
  @Post()
  async chat(@Req() req, @Body() body: { message: string; history?: any[] }) {
    const userId = req.user.userId; // Based on JwtStrategy which returns { userId, email, role }
=======
  @Post()
  @ApiOperation({ summary: 'Send a message to the AI shopping chatbot' })
  @ApiBody({ type: ChatMessageDto })
  @ApiResponse({ status: 200, description: 'Chatbot reply with optional product recommendations' })
  async chat(@Req() req, @Body() body: ChatMessageDto) {
    const userId = req.user.userId;
>>>>>>> 7dc2704 (add some dto)
    return this.chatbotService.handleChat(userId, body.message, body.history || []);
  }
}
