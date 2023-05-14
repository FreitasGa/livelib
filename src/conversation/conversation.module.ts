import { Module } from '@nestjs/common';

import { PrismaService } from 'src/database/prisma.service';
import { BooksService } from '../books/books.service';
import { ConversationController } from './conversation.controller';
import { ConversationService } from './conversation.service';
import { ClientsService } from 'src/clients/clients.service';
import { TasksService } from './conversation.schedule';

@Module({
  controllers: [ConversationController],
  providers: [
    ConversationService,
    BooksService,
    ClientsService,
    PrismaService,
    TasksService,
  ],
})
export class ConversationModule {}
