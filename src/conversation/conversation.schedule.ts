import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { ConfigService } from '@nestjs/config';
import { Twilio } from 'twilio';

import { BooksService } from '../books/books.service';
import { ClientsService } from 'src/clients/clients.service';
import { PrismaService } from 'src/database/prisma.service';
import { MessageUtils } from './utils/messages';

@Injectable()
export class TasksService {
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

  @Cron('0 8 * * 1')
  async handleCron() {
    await this.prisma.$connect();
    const clients = await this.clients.findAll();
    const books = await this.books.findAll(3);

    const message: string = MessageUtils.schedule(books);

    clients.forEach(async (client) => {
      this.client.messages.create({
        to: client.phone,
        from: this.configService.get<string>('twilio.number'),
        body: message,
      });
    });
  }
}
