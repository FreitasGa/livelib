import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';

import { ConversationModule } from './conversation/conversation.module';
import { PrismaService } from './database/prisma.service';
import { BooksModule } from './books/books.module';
import { ClientsModule } from './clients/clients.module';
import { GenresModule } from './genres/genres.module';
import { RentsModule } from './rents/rents.module';
import { MessagesModule } from './messages/messages.module';
import configuration from './config/default';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    ScheduleModule.forRoot(),
    ConversationModule,
    BooksModule,
    ClientsModule,
    GenresModule,
    RentsModule,
    MessagesModule,
  ],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
