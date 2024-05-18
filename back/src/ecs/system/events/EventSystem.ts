import { Entity } from '../../../../../shared/entity/Entity.js'
import { Component } from '../../../../../shared/component/Component.js'
import { EventDestroyed } from '../../../../../shared/component/events/EventDestroyed.js'
import { EventChatMessage } from '../../component/events/EventChatMessage.js'
import { EventColor } from '../../component/events/EventColor.js'
import { EventSingleSize } from '../../component/events/EventSingleSize.js'
import { EventSize } from '../../component/events/EventSize.js'
import { EventQueue } from '../../entity/EventQueue.js'
import { ChatSystem } from './ChatSystem.js'
import { DestroySystem } from './DestroySystem.js'
import { SyncColorSystem } from './SyncColorSystem.js'
import { SyncSingleSizeSystem } from './SyncSingleSizeSystem.js'
import { SyncSizeSystem } from './SyncSizeSystem.js'

// Define a type alias for event class constructors
type EventConstructor = new (...args: any[]) => Component

// Interface for System type
interface System {
  update(entities: Entity[], component: Component): void
  afterUpdate?(entities: Entity[], component: Component): void // Optional afterUpdate method
}

/* See https://gamedev.stackexchange.com/a/194135 */
export class EventSystem {
  private static instance: EventSystem
  private subscriptions: Map<EventConstructor, System[]> = new Map()
  private processedEvents: Component[] = []
  eventQueue: EventQueue

  static getInstance(): EventSystem {
    if (!EventSystem.instance) {
      EventSystem.instance = new EventSystem()
    }
    return EventSystem.instance
  }

  private constructor() {
    this.initializeSubscriptions()
    this.eventQueue = new EventQueue()
  }

  private initializeSubscriptions() {
    // Some components are treated as events.
    // Mapping Event Component (String representation of their classnames) to Systems
    // EventName : [System1, System2, ...]
    // Register systems
    this.subscriptions.set(EventChatMessage, [new ChatSystem()])
    this.subscriptions.set(EventDestroyed, [new DestroySystem()])
    this.subscriptions.set(EventSize, [new SyncSizeSystem()])
    this.subscriptions.set(EventSingleSize, [new SyncSingleSizeSystem()])
    this.subscriptions.set(EventColor, [new SyncColorSystem()])
  }

  update(entities: Entity[]) {
    // Order matters
    this.handleComponents(entities, false, [
      EventDestroyed,
      EventChatMessage,
      EventSingleSize,
      EventSize,
      EventColor,
    ])
  }

  afterUpdate(entities: Entity[]) {
    this.handleComponents(entities, true, [EventDestroyed])
    this.cleanProcessedEvents()
  }
  // Duplicate components (events) are authorized for this one
  addEvent(event: Component) {
    this.eventQueue.entity.addComponent(event)
  }
  // Handle a component event
  // If multiple events are stored, they are all treated in the same frame
  // Doing them one by one might have caused issues when 2 clients disconnect at the same
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
    this.processedEvents = []
  }
}
