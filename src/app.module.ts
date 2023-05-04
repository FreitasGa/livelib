import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { ConversationModule } from './conversation/conversation.module';
import { PrismaService } from './database/prisma.service';
import { BooksModule } from './books/books.module';
import { UsersModule } from './users/users.module';
import configuration from './config/default';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    ConversationModule,
    BooksModule,
    UsersModule,
  ],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
