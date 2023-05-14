import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Twilio } from 'twilio';

import { PrismaService } from 'src/database/prisma.service';
import { MessageEventDto } from './dto/event.dto';
import { MessageUtils } from './utils/messages';
import { weekSkip } from './utils/skip';

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
    console.log(event);
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

    const messages = await this.prisma.message.findMany({
      take: 5,
      orderBy: {
        createdAt: 'desc',
      },
      where: {
        clientId: client.id,
      },
    });

    switch (messages[2].body) {
      case '2':
        return this.handleSearchRent(messages[1].body, event);
      case '3':
        return this.handleSearchRent(messages[1].body, event);
    }

    switch (messages[1].body) {
      case '1':
        return this.handleSuggestionRent(event);
      case '2':
        return this.handleSearch(event);
      case '3':
        return this.handleSearch(event);
    }

    switch (messages[0].body) {
      case '0':
        return this.handleMenu(event);
      case '1':
        return this.handleSuggestion(event);
      case '2':
        return this.handleSearchMenu(event);
      case '3':
        return this.handleRentMenu(event);
    }

    return this.handleMenu(event);
  }

  private async handleMenu(event: MessageEventDto) {
    return this.client.messages.create({
      to: event.From,
      from: event.To,
      body: MessageUtils.menu(),
    });
  }

  private async handleSuggestion(event: MessageEventDto) {
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

    return this.client.messages.create({
      to: event.From,
      from: event.To,
      body: MessageUtils.suggestion(books),
    });
  }

  private async handleSearchMenu(event: MessageEventDto) {
    return this.client.messages.create({
      to: event.From,
      from: event.To,
      body: MessageUtils.searchMenu(),
    });
  }

  private async handleRentMenu(event: MessageEventDto) {
    return this.client.messages.create({
      to: event.From,
      from: event.To,
      body: MessageUtils.rentMenu(),
    });
  }

  private async handleSearch(event: MessageEventDto) {
    const books = await this.prisma.book.findMany({
      take: 3,
      where: {
        title: {
          contains: event.Body,
          mode: 'insensitive',
        },
      },
    });

    return this.client.messages.create({
      to: event.From,
      from: event.To,
      body: MessageUtils.search(books),
    });
  }

  private async handleSearchRent(message: string, event: MessageEventDto) {
    const books = await this.prisma.book.findMany({
      take: 3,
      where: {
        title: {
          contains: message,
          mode: 'insensitive',
        },
      },
    });

    const index = parseInt(event.Body, 10) - 1;

    return this.client.messages.create({
      to: event.From,
      from: event.To,
      body: MessageUtils.rent(books[index]),
    });
  }

  private async handleSuggestionRent(event: MessageEventDto) {
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

    const index = parseInt(event.Body, 10) - 1;

    return this.client.messages.create({
      to: event.From,
      from: event.To,
      body: MessageUtils.rent(books[index]),
    });
  }
}
