import { EventType } from '../event-type';

export class OnConversationRemovedDto {
  EventType: EventType.OnConversationRemoved;
  ConversationSid: string;
  DateCreated: string;
  DateUpdated: string;
  DateRemoved: string;
  FriendlyName?: string;
  UniqueName?: string;
  Attributes: string;
  ChatServiceSid: string;
  MessagingServiceSid: string;
  State: string;
}
