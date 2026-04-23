import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { ChatbotService } from './chatbot.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@Controller('chatbot')
export class ChatbotController {
  constructor(private readonly chatbotService: ChatbotService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async chat(@Req() req, @Body() body: { message: string; history?: any[] }) {
    const userId = req.user.userId; // Based on JwtStrategy which returns { userId, email, role }
    return this.chatbotService.handleChat(userId, body.message, body.history || []);
  }
}
