import { EventType } from "./event-types";

export interface BaseEvent {
  id: string;
  type: EventType;
  timestamp: Date;
  payload: any;
}
