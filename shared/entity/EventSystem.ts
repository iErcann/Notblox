import { Component } from '../component/Component.js'
import { ComponentAddedEvent } from '../component/events/ComponentAddedEvent.js'
import { ComponentRemovedEvent } from '../component/events/ComponentRemovedEvent.js'
import { ComponentUpdatedEvent } from '../component/events/ComponentUpdatedEvent.js'

import { Entity } from './Entity.js'
import { EventQueue } from './EventQueue.js'

// Define a type alias for event class constructors
type EventConstructor = new (...args: any[]) => Component

// Interface for System type
interface System {
  update(entities: Entity[], component: Component): void
  afterUpdate?(entities: Entity[], component: Component): void // Optional afterUpdate method
}

/* See https://gamedev.stackexchange.com/a/194135 */
export class BaseEventSystem {
  private static instance: BaseEventSystem
  private static eventSystemConstructor: new () => BaseEventSystem
  private subscriptions: Map<EventConstructor, System[]> = new Map()
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
    this.initializeSubscriptions()
    this.eventQueue = new EventQueue()
  }

  static getInstance(): BaseEventSystem {
    if (!BaseEventSystem.instance) {
      BaseEventSystem.instance = new BaseEventSystem.eventSystemConstructor()
    }
    return BaseEventSystem.instance
  }

  initializeSubscriptions() {}
  update(entities: Entity[]) {}
  afterUpdate(entities: Entity[]) {
    this.cleanProcessedEvents()
  }

  // Duplicate components (events) are authorized for this one
  addEvent(event: Component) {
    this.eventQueue.entity.addComponent(event, false)
  }
  // Handle a component event
  // If multiple events are stored, they are all treated in the same frame
  // Doing them one by one might have caused issues when 2 clients disconnect at the same time
  private handleComponents(
    entities: Entity[],
    afterUpdate: boolean,
    eventClasses: EventConstructor[]
  ) {
    for (const EventClass of eventClasses) {
      const components = this.eventQueue.entity.getComponents(EventClass)
      if (components) {
        for (const component of components) {
          if (component) {
            if (this.subscriptions.has(EventClass)) {
              for (const system of this.subscriptions.get(EventClass)!) {
                if (afterUpdate) {
                  system.afterUpdate && system.afterUpdate(entities, component)
                } else {
                  system.update(entities, component)
                }
              }
              this.processedEvents.push(component)
            }
          }
        }
      }
    }
  }

  private cleanProcessedEvents() {
    for (const event of this.processedEvents) {
      this.eventQueue.entity.components.splice(this.eventQueue.entity.components.indexOf(event), 1)
    }

    // Removing ComponentAddedEvent/ComponentRemovedEvent /ComponentUpdatedEvent events from the event queue
    this.eventQueue.entity.components = this.eventQueue.entity.components.filter(
      (component) =>
        !(
          component instanceof ComponentAddedEvent ||
          component instanceof ComponentRemovedEvent ||
          component instanceof ComponentUpdatedEvent
        )
    )

    this.processedEvents = []
  }
  onComponentAdded<T extends Component>(addedComponent: T) {
    this.addEvent(new ComponentAddedEvent(addedComponent))
  }

  onComponentRemoved<T extends Component>(removedComponent: T) {
    this.addEvent(new ComponentRemovedEvent(removedComponent))
  }
}
