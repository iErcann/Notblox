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
    this.subscriptions.set(EventChatMessage, [new ChatSystem()])
    this.subscriptions.set(EventDestroyed, [new DestroySystem()])
    this.subscriptions.set(EventSize, [new SyncSizeSystem()])
    this.subscriptions.set(EventSingleSize, [new SyncSingleSizeSystem()])
    this.subscriptions.set(EventColor, [new SyncColorSystem()])
  }

  update(entities: Entity[]) {
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

  addEvent(event: Component) {
    this.eventQueue.entity.addComponent(event)
  }

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

// Interface for System type (optional)
interface System {
  update(entities: Entity[], component: Component): void
  afterUpdate?(entities: Entity[], component: Component): void // Optional afterUpdate method
}
