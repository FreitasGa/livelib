import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { ConversationModule } from './conversation/conversation.module';
import { PrismaService } from './database/prisma.service';
import { BooksModule } from './books/books.module';
import { ClientsModule } from './clients/clients.module';
import { GenresModule } from './genres/genres.module';
import { RentsModule } from './rents/rents.module';
import configuration from './config/default';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    ConversationModule,
    BooksModule,
    ClientsModule,
    GenresModule,
    RentsModule,
  ],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
