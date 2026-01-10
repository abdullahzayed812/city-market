import { BaseEvent } from "./base-event";
import { EventType } from "./event-types";

export interface EventSubscriber {
  handle(event: BaseEvent): Promise<void>;
}

export class EventBus {
  private subscribers: Map<EventType, EventSubscriber[]> = new Map();

  subscribe(eventType: EventType, subscriber: EventSubscriber): void {
    if (!this.subscribers.has(eventType)) {
      this.subscribers.set(eventType, []);
    }
    this.subscribers.get(eventType)!.push(subscriber);
  }

  async publish(event: BaseEvent): Promise<void> {
    const subscribers = this.subscribers.get(event.type) || [];
    await Promise.all(subscribers.map((sub) => sub.handle(event)));
  }
}

export const eventBus = new EventBus();
