import { Module } from '@nestjs/common';

import { PrismaService } from 'src/database/prisma.service';
import { BooksService } from './books.service';

@Module({
  controllers: [],
  providers: [BooksService, PrismaService],
})
export class BooksModule {}
