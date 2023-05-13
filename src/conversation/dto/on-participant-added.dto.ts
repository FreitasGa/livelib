import { EventType } from '../event-type';

export class OnParticipantAddedDto {
  EventType: EventType.OnParticipantAdded;
  ConversationSid: string;
  ParticipantSid: string;
  DateCreated: string;
  Identity?: string;
  RoleSid: string;
  Attributes: string;
  'MessagingBinding.ProxyAddress'?: string;
  'MessagingBinding.Address'?: string;
  'MessagingBinding.ProjectedAddress'?: string;
  'MessagingBinding.Type'?: string;
}
