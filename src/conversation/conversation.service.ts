import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Twilio } from 'twilio';

import { PrismaService } from 'src/database/prisma.service';
import { MessageEventDto } from './dto/event.dto';
import { MessageUtils } from './utils/messages';

@Injectable()
export class ConversationService {
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

  async onMessageEvent(event: MessageEventDto) {
    await this.prisma.$connect();

    let client = await this.prisma.client.findUnique({
      where: {
        phone: event.From,
      },
    });

    if (!client) {
      client = await this.prisma.client.create({
        data: {
          name: event.ProfileName,
          phone: event.From,
        },
      });
    }

    await this.prisma.message.create({
      data: {
        clientId: client.id,
        body: event.Body,
      },
    });

    const books = await this.prisma.book.findMany({
      take: 3,
    });

    let response: string;

    switch (event.Body) {
      case '1':
        response = MessageUtils.suggestion(books);
        break;
      case '2':
        response = MessageUtils.search();
        break;
      case '3':
        response = MessageUtils.rent();
        break;
      default:
        response = MessageUtils.menu();
        break;
    }

    this.client.messages.create({
      to: event.From,
      from: event.To,
      body: response,
    });
  }
}
