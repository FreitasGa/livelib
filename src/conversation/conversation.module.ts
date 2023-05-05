import { Module } from '@nestjs/common';
import { ConversationService } from './conversation.service';
import { ConversationController } from './conversation.controller';
import { BooksService } from '../books/books.service';
import { PrismaService } from 'src/database/prisma.service';

@Module({
  controllers: [ConversationController],
  providers: [ConversationService, BooksService, PrismaService],
})
export class ConversationModule {}
