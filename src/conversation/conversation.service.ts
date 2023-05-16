import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cart, Client, State } from '@prisma/client';
import { Twilio } from 'twilio';

import { add } from 'date-fns';
import { PrismaService } from 'src/database/prisma.service';
import { MessageEventDto } from './dto/event.dto';
import { MessageUtils } from './utils/messages';
import { weekSkip } from './utils/skip';
import { wait } from './utils/time';

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
    console.log('Message event received', {
      profile: event.ProfileName,
      from: event.From,
      to: event.To,
      body: event.Body,
    });

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

    let cart = await this.prisma.cart.findUnique({
      where: {
        clientId: client.id,
      },
    });

    if (!cart) {
      cart = await this.prisma.cart.create({
        data: {
          clientId: client.id,
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
      take: 3,
      orderBy: {
        createdAt: 'desc',
      },
      where: {
        clientId: client.id,
      },
    });

    if (client.state === 'Main') {
      switch (messages[0].body) {
        case '1':
          return this.suggestion(event, client);
        case '2':
          return this.prompt(event, client, 'search');
        case '3':
          return this.prompt(event, client, 'rent');
        case '4':
          return this.cart(event, client, cart);
      }
    }

    if (client.state === 'Suggestion') {
      if (
        messages[0].body === '1' ||
        messages[0].body === '2' ||
        messages[0].body === '3'
      ) {
        return this.suggestionConfirmation(event, client, cart);
      }
    }

    if (client.state === 'Search') {
      if (messages[0].body === '0') {
        return this.main(event, client, cart);
      } else if (
        messages[0].body === '1' ||
        messages[0].body === '2' ||
        messages[0].body === '3'
      ) {
        return this.searchConfirmation(event, client, cart, messages[1].body);
      }

      return this.search(event, client);
    }

    if (client.state === 'Rent') {
      if (messages[0].body === '0') {
        return this.main(event, client, cart);
      } else if (
        messages[0].body === '1' ||
        messages[0].body === '2' ||
        messages[0].body === '3'
      ) {
        return this.searchConfirmation(event, client, cart, messages[1].body);
      }

      return this.search(event, client);
    }

    if (client.state === 'Confirmation') {
      const books = await this.prisma.cart.findUnique({
        where: {
          id: cart.id,
        },
      });

      switch (messages[0].body) {
        case '0':
          cart = await this.prisma.cart.update({
            where: {
              id: cart.id,
            },
            data: {
              bookIds: {
                set: books?.bookIds.slice(0, -1),
              },
            },
          });
          return this.main(event, client, cart);
        case '1':
          await this.client.messages.create({
            to: event.From,
            from: event.To,
            body: MessageUtils.addedToCart(),
          });
          break;
        case '2':
          await this.prisma.cart.update({
            where: {
              id: cart.id,
            },
            data: {
              bookIds: {
                set: books?.bookIds.slice(0, -1),
              },
            },
          });
          return this.suggestion(event, client);
      }
    }

    if (client.state === 'Cart') {
      switch (messages[0].body) {
        case '0':
          return this.main(event, client, cart);
        case '1':
          return this.rent(event, client, cart);
        case '2':
          return this.cartClear(event, client, cart);
      }
    }

    return this.main(event, client, cart);
  }

  private async main(event: MessageEventDto, client: Client, cart: Cart) {
    await this.setState(client, 'Main');

    await this.client.messages.create({
      to: event.From,
      from: event.To,
      body: MessageUtils.main(cart.bookIds.length),
    });
  }

  private async suggestion(event: MessageEventDto, client: Client) {
    await this.setState(client, 'Suggestion');

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

    await this.client.messages.create({
      to: event.From,
      from: event.To,
      body: MessageUtils.suggestion(books),
    });
  }

  private async prompt(
    event: MessageEventDto,
    client: Client,
    mode: 'search' | 'rent',
  ) {
    const state = mode === 'search' ? 'Search' : 'Rent';
    await this.setState(client, state);

    await this.client.messages.create({
      to: event.From,
      from: event.To,
      body: MessageUtils.prompt(mode),
    });
  }

  private async search(event: MessageEventDto, client: Client) {
    await this.setState(client, 'Search');

    const books = await this.prisma.book.findMany({
      take: 3,
      where: {
        title: {
          contains: event.Body,
          mode: 'insensitive',
        },
      },
    });

    await this.client.messages.create({
      to: event.From,
      from: event.To,
      body: MessageUtils.search(books),
    });
  }

  private async searchConfirmation(
    event: MessageEventDto,
    client: Client,
    cart: Cart,
    oldMessage: string,
  ) {
    await this.setState(client, 'Confirmation');

    const books = await this.prisma.book.findMany({
      take: 3,
      where: {
        title: {
          contains: oldMessage,
          mode: 'insensitive',
        },
      },
    });

    const index = parseInt(event.Body, 10) - 1;

    await this.client.messages.create({
      to: event.From,
      from: event.To,
      body: MessageUtils.book(books[index]),
      mediaUrl: [books[index].cover],
    });

    await wait(750);
    await this.client.messages.create({
      to: event.From,
      from: event.To,
      body: MessageUtils.confirmation(),
    });

    await this.prisma.cart.update({
      where: {
        id: cart.id,
      },
      data: {
        bookIds: {
          push: books[index].id,
        },
      },
    });
  }

  private async suggestionConfirmation(
    event: MessageEventDto,
    client: Client,
    cart: Cart,
  ) {
    await this.setState(client, 'Confirmation');

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

    await this.client.messages.create({
      to: event.From,
      from: event.To,
      body: MessageUtils.book(books[index]),
      mediaUrl: [books[index].cover],
    });

    await wait(750);
    await this.client.messages.create({
      to: event.From,
      from: event.To,
      body: MessageUtils.confirmation(),
    });

    await this.prisma.cart.update({
      where: {
        id: cart.id,
      },
      data: {
        bookIds: {
          push: books[index].id,
        },
      },
    });
  }

  private async rent(event: MessageEventDto, client: Client, cart: Cart) {
    await this.setState(client, 'Rent');

    const books = await this.prisma.book.findMany({
      where: {
        id: {
          in: cart.bookIds,
        },
      },
    });

    await this.prisma.rent.create({
      data: {
        clientId: client.id,
        bookIds: {
          set: cart.bookIds,
        },
        startDate: new Date(),
        endDate: add(new Date(), { weeks: 2 }),
        price: 0,
      },
    });

    await this.client.messages.create({
      to: event.From,
      from: event.To,
      body: MessageUtils.rent(books),
      mediaUrl: [books[0].cover],
    });

    await this.prisma.cart.update({
      where: {
        id: cart.id,
      },
      data: {
        bookIds: {
          set: [],
        },
      },
    });
  }

  private async cart(event: MessageEventDto, client: Client, cart: Cart) {
    await this.setState(client, 'Cart');

    const books = await this.prisma.book.findMany({
      where: {
        id: {
          in: cart.bookIds,
        },
      },
    });

    await this.client.messages.create({
      to: event.From,
      from: event.To,
      body: MessageUtils.cart(books),
    });
  }

  private async cartClear(event: MessageEventDto, client: Client, cart: Cart) {
    await this.setState(client, 'Cart');

    cart = await this.prisma.cart.update({
      where: {
        id: cart.id,
      },
      data: {
        bookIds: {
          set: [],
        },
      },
    });

    await this.client.messages.create({
      to: event.From,
      from: event.To,
      body: MessageUtils.cartClear(),
    });

    return this.main(event, client, cart);
  }

  private async setState(client: Client, state: State) {
    if (client.state !== state) {
      await this.prisma.client.update({
        where: {
          id: client.id,
        },
        data: {
          state,
        },
      });
    }
  }
}
