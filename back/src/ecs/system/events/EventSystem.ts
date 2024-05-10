import { Component } from "../../../../../shared/component/Component.js";
import { Entity } from "../../../../../shared/entity/Entity.js";
import { EventChatMessage } from "../../component/events/EventChatMessage.js";
import { EventSize } from "../../component/events/EventSize.js";
import { EventQueue } from "../../entity/EventQueue.js";
import { ChatSystem } from "./ChatSystem.js";

/* See https://gamedev.stackexchange.com/a/194135 */
export class EventSystem {
  private static instance: EventSystem;

  public static getInstance(): EventSystem {
    if (!EventSystem.instance) {
      EventSystem.instance = new EventSystem();
    }
    return EventSystem.instance;
  }

  // Some components are treated as events.
  // Mapping Event Component (String representation of their classnames) to Systems
  // EventName : [System1, System2, ...]
  private subscriptions: Map<string, any[]> = new Map();
  private eventQueue: EventQueue;
  private constructor() {
    this.eventQueue = new EventQueue();
    this.subscriptions.set(EventChatMessage.name, [new ChatSystem()]);
    this.subscriptions.set(EventSize.name, []);
  }
  update(entities: Entity[]) {
    // This only treats the first event in the queue, if duplicates
    // It will be treated in the next loop iteration
    this.handleComponent(entities, EventChatMessage);
    // this.handleComponent(entities, EventSize);
  }
  public addEvent(event: Component) {
    this.eventQueue.entity.addComponent(event);
  }

  private handleComponent<T extends Component>(
    entities: Entity[],
    eventClassName: new (...args: any[]) => T
  ) {
    const component = this.eventQueue.entity.getComponent(eventClassName);
    if (component) {
      const componentName = component.constructor.name;
      if (this.subscriptions.has(componentName)) {
        for (const system of this.subscriptions.get(componentName)!) {
          // All entities are passed to the system to allow systems to perform operations
          system.update(entities, component);
        }
        // Remove the event from the event queue
        this.eventQueue.entity.components.splice(
          this.eventQueue.entity.components.indexOf(component),
          1
        );
      }
    }
  }
}
