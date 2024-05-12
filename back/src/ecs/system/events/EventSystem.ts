import { EventDestroyed } from "../../../../../shared/component/events/EventDestroyed.js";
import { Component } from "../../../../../shared/component/Component.js";
import { Entity } from "../../../../../shared/entity/Entity.js";
import { EventChatMessage } from "../../component/events/EventChatMessage.js";
import { EventSize } from "../../component/events/EventSize.js";
import { EventQueue } from "../../entity/EventQueue.js";
import { ChatSystem } from "./ChatSystem.js";
import { DestroySystem } from "./DestroySystem.js";

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
  eventQueue: EventQueue;
  private processedEvents: Component[] = [];

  private constructor() {
    this.eventQueue = new EventQueue();
    // Register systems
    this.subscriptions.set(EventChatMessage.name, [new ChatSystem()]);
    this.subscriptions.set(EventDestroyed.name, [new DestroySystem()]);
    this.subscriptions.set(EventSize.name, []);
  }
  update(entities: Entity[]) {
    // Order matters
    this.handleComponent(entities, EventDestroyed);
    this.handleComponent(entities, EventChatMessage);
    // this.handleComponent(entities, EventSize);
  }
  afterUpdate(entities: Entity[]) {
    this.handleComponent(entities, EventDestroyed, true);

    if (this.processedEvents.length > 0) {
      console.log(
        "EventSystem : afterUpdate : processedEvents",
        this.processedEvents
      );
    }
    // Remove proccessed events
    for (const event of this.processedEvents) {
      this.eventQueue.entity.components.splice(
        this.eventQueue.entity.components.indexOf(event),
        1
      );
    }
    this.processedEvents = [];
  }
  // Duplicate components (events) are authorized for this one
  public addEvent(event: Component) {
    this.eventQueue.entity.addComponent(event);
  }

  // Handle a component event
  // If multiple events are stored, they are all treated in the same frame
  // Doing them one by one might have caused issues when 2 clients disconnect at the same time for example
  private handleComponent<T extends Component>(
    entities: Entity[],
    eventClassName: new (...args: any[]) => T,
    afterUpdate: boolean = false
  ) {
    const components = this.eventQueue.entity.getComponents(eventClassName);
    if (components) {
      for (const component of components) {
        if (component) {
          const componentName = component.constructor.name;
          if (this.subscriptions.has(componentName)) {
            for (const system of this.subscriptions.get(componentName)!) {
              // System call order is respected

              // All entities are passed to the system to allow systems to perform operations
              afterUpdate
                ? system.afterUpdate(entities, component)
                : system.update(entities, component);
            }
            this.processedEvents.push(component);
          }
        }
      }
    }
  }
}
