import { EventType } from '../event-type';

export class OnConversationUpdatedDto {
  EventType: EventType.OnConversationUpdated;
  ConversationSid: string;
  DateCreated: string;
  DateUpdated: string;
  FriendlyName?: string;
  UniqueName?: string;
  Attributes: string;
  ChatServiceSid: string;
  MessagingServiceSid: string;
  State: string;
}
