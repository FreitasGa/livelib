import { EventType } from '../event-type';

export class PostEventDto {
  AccountSid: string;
  EventType: EventType;
  Source: string;
}
