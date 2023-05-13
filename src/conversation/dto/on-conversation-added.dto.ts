import { EventType } from '../event-type';

export class OnConversationAddedDto {
  EventType: EventType.OnConversationAdded;
  ConversationSid: string;
  DateCreated: string;
  DateUpdated: string;
  FriendlyName?: string;
  UniqueName?: string;
  Attributes: string;
  ChatServiceSid: string;
  MessagingServiceSid: string;
  'MessagingBinding.ProxyAddress'?: string;
  'MessagingBinding.Address'?: string;
  'MessagingBinding.ProjectedAddress'?: string;
  'MessagingBinding.AuthorAddress'?: string;
  State: string;
  ChannelMetadata: string;
}
