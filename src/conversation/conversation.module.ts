import { Module } from '@nestjs/common';

import { PrismaService } from 'src/database/prisma.service';
import { BooksService } from '../books/books.service';
import { ConversationController } from './conversation.controller';
import { ConversationService } from './conversation.service';

@Module({
  controllers: [ConversationController],
  providers: [ConversationService, BooksService, PrismaService],
})
export class ConversationModule {}
