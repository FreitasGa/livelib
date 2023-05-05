import { Module } from '@nestjs/common';

import { PrismaService } from 'src/database/prisma.service';
import { ClientsService } from './clients.service';

@Module({
  controllers: [],
  providers: [ClientsService, PrismaService],
})
export class ClientsModule {}
