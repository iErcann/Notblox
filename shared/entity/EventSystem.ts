import { ComponentWrapper } from 'shared/component/events/ComponentWrapper.js'
import { Component } from '../component/Component.js'
import { ComponentAddedEvent } from '../component/events/ComponentAddedEvent.js'
import { ComponentRemovedEvent } from '../component/events/ComponentRemovedEvent.js'
import { ComponentUpdatedEvent } from '../component/events/ComponentUpdatedEvent.js'

import { Entity } from './Entity.js'
import { EventQueue } from './EventQueue.js'

/* See https://gamedev.stackexchange.com/a/194135 */
export class BaseEventSystem {
  private static instance: BaseEventSystem
  private static eventSystemConstructor: new () => BaseEventSystem
  private processedEvents: Component[] = []
  eventQueue: EventQueue

  // Client and server will have different event systems
  // But they share the same BaseEventSystem
  // We inject the event system constructor to create the right event system
  // So we don't have to import the server side code client side & vise versa
  static setEventSystemConstructor(eventSystemConstructor: new () => BaseEventSystem) {
    BaseEventSystem.eventSystemConstructor = eventSystemConstructor
  }
  constructor() {
    this.eventQueue = new EventQueue()
  }

  static getInstance(): BaseEventSystem {
    if (!BaseEventSystem.instance) {
      BaseEventSystem.instance = new BaseEventSystem.eventSystemConstructor()
    }
    return BaseEventSystem.instance
  }

  afterUpdate(entities: Entity[]) {
    this.cleanProcessedEvents()
  }

  // Add an event to the event queue
  // Duplicate components (events) are authorized for this one
  static addEvent(event: Component) {
    BaseEventSystem.getInstance().eventQueue.entity.addComponent(event, false)
  }

  private cleanProcessedEvents() {
    // TODO: Check if asynchroneous events are processed correctly (ChatMessageEvent, etc.)
    // Removing all events for now
    this.eventQueue.entity.components = []

    // for (const event of this.processedEvents) {
    //   this.eventQueue.entity.components.splice(this.eventQueue.entity.components.indexOf(event), 1)
    // }

    // // Removing ComponentAddedEvent/ComponentRemovedEvent /ComponentUpdatedEvent events from the event queue
    // this.eventQueue.entity.components = this.eventQueue.entity.components.filter(
    //   (component) =>
    //     !(
    //       component instanceof ComponentAddedEvent ||
    //       component instanceof ComponentRemovedEvent ||
    //       component instanceof ComponentUpdatedEvent
    //     )
    // )

    // this.processedEvents = []
  }
  static getEvents() {
    return BaseEventSystem.getInstance().eventQueue.entity.components
  }

  /**
   * Example usage
   * BaseEventSystem.getEventsByType(ChatMessageEvent)
   */
  static getEventsByType<T extends Component>(componentType: new (...args: any[]) => T): T[] {
    return BaseEventSystem.getInstance().eventQueue.entity.getComponents(componentType)
  }

  /**
   *  Example usage
   *  BaseEventSystem.getEventsByWrappedType(ComponentAddedEvent, ColorComponent)
   *  BaseEventSystem.getEventsByWrappedType(ComponentRemovedEvent, ColorComponent)
   */
  static getEventsWrapped<E extends ComponentWrapper<T>, T extends Component>(
    eventType: new (...args: any[]) => E,
    componentType: new (...args: any[]) => T
  ): E[] {
    // Filtering by ComponentAddedEvent<T> for example
    const events = BaseEventSystem.getEventsByType(eventType)
    // Then filtering by its wrapped component type
    return events.filter((event) => event.component instanceof componentType) as E[]
  }

  static onComponentAdded<T extends Component>(addedComponent: T) {
    BaseEventSystem.addEvent(new ComponentAddedEvent(addedComponent))
  }

  static onComponentRemoved<T extends Component>(removedComponent: T) {
    BaseEventSystem.addEvent(new ComponentRemovedEvent(removedComponent))
  }
}
