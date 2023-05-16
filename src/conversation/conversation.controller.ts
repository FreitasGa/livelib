import { Body, Controller, Post } from '@nestjs/common';
import { ConversationService } from './conversation.service';
import { MessageEventDto } from './dto/event.dto';

@Controller('conversation')
export class ConversationController {
  constructor(private readonly conversationService: ConversationService) {}

  @Post()
  handle(@Body() event: MessageEventDto) {
    this.conversationService.onMessageEvent(event);
  }
}
