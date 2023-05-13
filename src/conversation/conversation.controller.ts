import { Body, Controller, Post } from '@nestjs/common';
import { ConversationService } from './conversation.service';
import { PostEventDto } from './dto/post-event.dto';

@Controller('conversation')
export class ConversationController {
  constructor(private readonly conversationService: ConversationService) {}

  @Post('post-event')
  handlePostEvent(@Body() event: PostEventDto) {
    this.conversationService.onPostEvent(event);
  }
}
