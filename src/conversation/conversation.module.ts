import { Module } from '@nestjs/common';

import { PrismaService } from 'src/database/prisma.service';
import { ConversationController } from './conversation.controller';
import { ConversationSchedule } from './conversation.schedule';
import { ConversationService } from './conversation.service';

@Module({
  controllers: [ConversationController],
  providers: [ConversationService, PrismaService, ConversationSchedule],
})
export class ConversationModule {}
