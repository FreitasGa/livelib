import { Module } from '@nestjs/common';

import { PrismaService } from 'src/database/prisma.service';
import { RentsService } from './rents.service';

@Module({
  controllers: [],
  providers: [RentsService, PrismaService],
})
export class RentsModule {}
