import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Twilio } from 'twilio';

import { PrismaService } from 'src/database/prisma.service';
import { BooksService } from '../books/books.service';
import { ClientsService } from '../clients/clients.service';
import { MessageEventDto } from './dto/event.dto';
import { MessageUtils } from './utils/messages';

@Injectable()
export class ConversationService {
  private client: Twilio;

  constructor(
    private configService: ConfigService,
    private books: BooksService,
    private clients: ClientsService,
    private prisma: PrismaService,
  ) {
    this.client = new Twilio(
      this.configService.get<string>('twilio.accountSid'),
      this.configService.get<string>('twilio.authToken'),
    );
  }

  async onMessageEvent(event: MessageEventDto) {
    await this.prisma.$connect();

    const client = await this.clients.findOneByNumber(event.From);
    const books = await this.books.findAll(3);

    await this.prisma.message.create({
      data: {
        clientId: client.id,
        body: event.Body,
      },
    });

    if (!client) {
      await this.clients.create({
        name: event.ProfileName,
        phone: event.From,
      });
    }

    let message: string;

    switch (event.Body) {
      case '1':
        message = MessageUtils.suggestion(books);
        break;
      case '2':
        message = MessageUtils.search();
        break;
      case '3':
        message = MessageUtils.rent();
        break;
      default:
        message = MessageUtils.menu();
        break;
    }

    this.client.messages.create({
      to: event.From,
      from: event.To,
      body: message,
    });
  }
}
