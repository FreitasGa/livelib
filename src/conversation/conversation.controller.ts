import { Body, Controller, Post } from '@nestjs/common';
import { ConversationService } from './conversation.service';
import { EventDto } from './dto/event.dto';

@Controller('conversation')
export class ConversationController {
  constructor(private readonly conversationService: ConversationService) {}

  @Post()
  handle(@Body() event: EventDto) {
    console.log(event);
    this.conversationService.onMessageAdded(event);
  }
}
