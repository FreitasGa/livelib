import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';

import { ConversationModule } from './conversation/conversation.module';
import { PrismaService } from './database/prisma.service';
import configuration from './config/default';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    ScheduleModule.forRoot(),
    ConversationModule,
  ],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
