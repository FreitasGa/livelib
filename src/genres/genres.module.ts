import { Module } from '@nestjs/common';

import { PrismaService } from 'src/database/prisma.service';
import { GenresService } from './genres.service';

@Module({
  controllers: [],
  providers: [GenresService, PrismaService],
})
export class GenresModule {}
