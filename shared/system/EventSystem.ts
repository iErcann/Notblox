import { ComponentWrapper } from '../component/events/ComponentWrapper.js'
import { Component } from '../component/Component.js'
import { ComponentAddedEvent } from '../component/events/ComponentAddedEvent.js'
import { ComponentRemovedEvent } from '../component/events/ComponentRemovedEvent.js'

import { Entity } from '../entity/Entity.js'
import { EventQueue } from '../entity/EventQueue.js'
import { NetworkDataComponent } from '../network/NetworkDataComponent.js'
import { NetworkComponent } from '../network/NetworkComponent.js'
import { EntityDestroyedEvent } from '../../shared/component/events/EntityDestroyedEvent.js'

/* See https://gamedev.stackexchange.com/a/194135 */
export class BaseEventSystem {
  private static instance: BaseEventSystem
  private static eventSystemConstructor: new () => BaseEventSystem
  private processedEvents: Component[] = []
  eventQueue: EventQueue

  private constructor() {
    this.eventQueue = new EventQueue()
  }

  static getInstance(): BaseEventSystem {
    if (!BaseEventSystem.instance) {
      BaseEventSystem.instance = new BaseEventSystem()
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

  /**
   * Add a network event to the event queue
   * Also add the event to the NetworkDataComponent so it can be sent to the client and replicated
   */
  static addNetworkEvent(event: NetworkComponent) {
    const eventQueueEntity = BaseEventSystem.getInstance().eventQueue.entity
    if (!eventQueueEntity) {
      console.error('EventQueue entity not found')
      return
    }

    eventQueueEntity.addComponent(event, false)
    const networkDataComponent = eventQueueEntity.getComponent(NetworkDataComponent)

    if (!networkDataComponent) {
      console.error('NetworkDataComponent not found on the EventQueue entity')
      return
    }
    networkDataComponent.addComponent(event)
  }
  private cleanProcessedEvents() {
    // TODO: Check if asynchroneous events are processed correctly (ChatMessageEvent, etc.)
    // Removing all components except NetworkDataComponent
    for (const component of this.eventQueue.entity.components) {
      if (!(component instanceof NetworkDataComponent)) {
        this.eventQueue.entity.removeComponent(
          component.constructor as new (...args: any[]) => Component,
          false
        )
      }
    }
    this.eventQueue.entity.getComponent(NetworkDataComponent)?.removeAllComponents()

    // TODO : Clear the NetworkDataComponent of EventQueue entity

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
