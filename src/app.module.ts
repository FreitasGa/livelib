import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { ConversationModule } from './conversation/conversation.module';
import { PrismaService } from './prisma.service';
import configuration from './config/default';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    ConversationModule,
  ],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
