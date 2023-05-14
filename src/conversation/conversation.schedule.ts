import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron } from '@nestjs/schedule';
import { Twilio } from 'twilio';

import { PrismaService } from 'src/database/prisma.service';
import { MessageUtils } from './utils/messages';
import { weekSkip } from './utils/skip';

@Injectable()
export class ConversationSchedule {
  private client: Twilio;

  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {
    this.client = new Twilio(
      this.configService.get<string>('twilio.accountSid'),
      this.configService.get<string>('twilio.authToken'),
    );
  }

  @Cron('0 8 * * 1')
  async handleCron() {
    await this.prisma.$connect();

    const genresCount = await this.prisma.genre.count();
    const genresIds = await this.prisma.genre.findMany({
      take: 3,
      skip: weekSkip(genresCount),
      select: {
        id: true,
      },
    });

    const books = await this.prisma.book.findMany({
      take: 3,
      where: {
        genreIds: {
          hasSome: genresIds.map((genre) => genre.id),
        },
      },
    });

    const clients = await this.prisma.client.findMany();

    const from = this.configService.get<string>('twilio.number');
    const body = MessageUtils.schedule(books);

    clients.forEach(async (client) => {
      await this.client.messages.create({
        to: client.phone,
        from,
        body,
      });
    });
  }
}
