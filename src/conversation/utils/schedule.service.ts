import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { ConfigService } from '@nestjs/config';
import { Twilio } from 'twilio';

import { BooksService } from '../../books/books.service';
import { ClientsService } from 'src/clients/clients.service';
import { PrismaService } from 'src/database/prisma.service';

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
    const books = await this.books.findAll();

    let message: string;

    message = `Olá, aqui estão três livros que eu recomendo para você ler esta semana:\n\n`;

    books.forEach((book, index) => {
      if (index < 3) {
        message += `${index + 1}. ${book.title} - ${book.description}\n\n`;
      }
    });

    message += 'Boa leitura!';

    clients.forEach(async (client) => {
      this.client.messages.create({
        to: client.phone,
        from: this.configService.get<string>('twilioNumber'),
        body: message,
      });
    });
  }
}
