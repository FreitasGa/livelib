import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Twilio } from 'twilio';

import { PrismaService } from 'src/database/prisma.service';
import { BooksService } from '../books/books.service';
import { ClientsService } from '../clients/clients.service';
import { OnConversationAddedDto } from './dto/on-conversation-added.dto';
import { OnConversationRemovedDto } from './dto/on-conversation-removed.dto';
import { OnConversationUpdatedDto } from './dto/on-conversation-updated.dto';
import { OnMessageAddedDto } from './dto/on-message-added.dto';
import { OnParticipantAddedDto } from './dto/on-participant-added.dto';
import { PostEventDto } from './dto/post-event.dto';
import { EventType } from './event-type';
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

  onPostEvent(event: PostEventDto) {
    switch (event.EventType) {
      case EventType.OnConversationAdded:
        return this.onConversationAdded(
          event as unknown as OnConversationAddedDto,
        );
      case EventType.OnConversationRemoved:
        return this.onConversationRemoved(
          event as unknown as OnConversationRemovedDto,
        );
      case EventType.OnConversationUpdated:
        return this.onConversationUpdated(
          event as unknown as OnConversationUpdatedDto,
        );
      case EventType.OnMessageAdded:
        return this.onMessageAdded(event as unknown as OnMessageAddedDto);
      case EventType.OnParticipantAdded:
        return this.onParticipantAdded(
          event as unknown as OnParticipantAddedDto,
        );
      default:
        throw new Error(`Unknown event type: ${event.EventType}`);
    }
  }

  private async onConversationAdded(event: OnConversationAddedDto) {
    console.log('Conversation added', event);

    return this.client.conversations.v1
      .conversations(event.ConversationSid)
      .participants.create({
        identity: 'chatbot',
      });
  }

  private async onConversationRemoved(event: OnConversationRemovedDto) {
    console.log('Conversation removed', event);
  }

  private async onConversationUpdated(event: OnConversationUpdatedDto) {
    console.log('Conversation updated', event);
  }

  private async onMessageAdded(event: OnMessageAddedDto) {
    console.log('Message added', event);

    const conversation = await this.client.conversations.v1
      .conversations(event.ConversationSid)
      .fetch();

    return conversation.messages().create({
      body: MessageUtils.menu(),
      author: 'chatbot',
    });
  }

  private async onParticipantAdded(event: OnParticipantAddedDto) {
    console.log('Participant added', event);
  }
}
