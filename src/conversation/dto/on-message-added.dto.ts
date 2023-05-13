import { EventType } from '../event-type';

export class OnMessageAddedDto {
  EventType: EventType.OnMessageAdded;
  ConversationSid: string;
  MessageSid: string;
  MessagingServiceSid: string;
  Index: number;
  DateCreated: string;
  Body: string;
  Author: string;
  ParticipantSid?: string;
  Attributes: string;
  Media?: string;
  ChannelMetadata: string;
}
