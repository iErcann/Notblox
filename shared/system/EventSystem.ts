import { ComponentWrapper } from '../component/events/ComponentWrapper.js'
import { Component, ComponentConstructor } from '../component/Component.js'
import { ComponentAddedEvent } from '../component/events/ComponentAddedEvent.js'
import {
  ComponentRemovedEvent,
  SerializableComponentRemovedEvent,
} from '../component/events/ComponentRemovedEvent.js'

import { Entity } from '../entity/Entity.js'
import { EventQueue } from '../entity/EventQueue.js'
import { NetworkDataComponent } from '../network/NetworkDataComponent.js'
import { NetworkComponent } from '../network/NetworkComponent.js'
import { EventListComponent } from '../../shared/component/events/EventListComponent.js'
import { config } from '../network/config.js'

/* See https://gamedev.stackexchange.com/a/194135 */
export class EventSystem {
  private static instance: EventSystem
  eventQueue: EventQueue

  private constructor() {
    this.eventQueue = new EventQueue()
  }

  /**
   * Singleton pattern to get the instance of EventSystem
   */
  static getInstance(): EventSystem {
    if (!EventSystem.instance) {
      EventSystem.instance = new EventSystem()
    }
    return EventSystem.instance
  }

  /**
   * Called after the update loop to clean up processed events
   * @param entities Array of entities to process
   */
  afterUpdate(entities: Entity[]) {
    this.cleanProcessedEvents()
  }

  /**
   * Add an event to the event queue
   * @param event The event component to add
   */
  static addEvent(event: Component) {
    const eventQueueEntity = EventSystem.getInstance().eventQueue.entity
    if (!eventQueueEntity) {
      console.error('EventQueue entity not found')
      return
    }

    const eventListComponent = eventQueueEntity.getComponent(EventListComponent)
    if (!eventListComponent) {
      console.error('EventListComponent not found on the EventQueue entity')
      return
    }

    eventListComponent.addEvent(event)
  }

  /**
   * Add a network event to the event queue
   * Also add the event to the NetworkDataComponent so it can be sent to the client and replicated
   * @param event  The network event component to add
   */
  static addNetworkEvent(event: NetworkComponent) {
    const eventQueueEntity = EventSystem.getInstance().eventQueue.entity
    if (!eventQueueEntity) {
      console.error('EventQueue entity not found')
      return
    }

    EventSystem.addEvent(event)

    const networkDataComponent = eventQueueEntity.getComponent(NetworkDataComponent)
    if (!networkDataComponent) {
      console.error('NetworkDataComponent not found on the EventQueue entity')
      return
    }

    networkDataComponent.addComponent(event)
  }

  /**
   * Remove all processed events from the event queue
   */
  private cleanProcessedEvents() {
    // Removing all events from the event queue
    this.eventQueue.entity.getComponent(EventListComponent)?.removeAllEvents()

    // Removing the network event components from the NetworkDataComponent, they have been sent to the client
    this.eventQueue.entity.getComponent(NetworkDataComponent)?.removeAllComponents()

    // TODO: Check if asynchronous events are processed correctly (ChatMessageEvent, etc.)
  }

  /**
   * Get all components from the event queue entity
   * @returns Array of components
   */
  static getAllEvents() {
    return EventSystem.getInstance().eventQueue.entity.components
  }

  /**
   * Get events of a specific type from the event queue
   * @param componentType The type of the event component to get
   * @returns Array of event components of the specified type
   */
  static getEvents<T extends Component>(componentType: ComponentConstructor<T>): T[] {
    const eventListComponent =
      EventSystem.getInstance().eventQueue.entity.getComponent(EventListComponent)!
    return eventListComponent.getEvents(componentType)
  }

  /**
   * Get events wrapped by a specific component wrapper type
   * @param eventType The type of the event wrapper component (e.g., ComponentAddedEvent, ComponentRemovedEvent, etc.)
   * @param componentType The type of the wrapped event component
   * @returns Array of wrapped event components
   * @example
   * ```typescript
   *  EventSystem.getEventsWrapped(ComponentAddedEvent, BoxColliderComponent)
   *  EventSystem.getEventsWrapped(ComponentRemovedEvent, BoxColliderComponent)
   * ```
   */

  // TODO: Find a way to infer subtypes
  static getEventsWrapped<E extends ComponentWrapper<T>, T extends Component>(
    eventType: new (...args: any[]) => E,
    componentType: ComponentConstructor<T>
  ): E[] {
    // Filtering by eventType (e.g., ComponentAddedEvent)
    const events: E[] = EventSystem.getEvents(eventType)

    // Then filtering by its wrapped component type
    const eventsWrapped = events.filter(
      (event: E): event is E => event.component instanceof componentType
    )
    return eventsWrapped
  }

  /**
   * Handle component added event
   * @param addedComponent The component that was added
   */
  static onComponentAdded<T extends Component>(addedComponent: T) {
    EventSystem.addEvent(new ComponentAddedEvent(addedComponent))
  }

  /**
   * Handle component removed event
   * Also, if we are on the server, send a component removed event to the client so it can be removed from the client entity
   * @param removedComponent The component that was removed
   */
  static onComponentRemoved<T extends Component>(removedComponent: T) {
    /**
     * Local event
     */
    EventSystem.addEvent(new ComponentRemovedEvent(removedComponent))

    /**
     * Network event
     * If the component is a network component, we need to send a component removed event to the client
     * Only if we are on the server
     */
    if (config.IS_SERVER && removedComponent instanceof NetworkComponent) {
      const componentRemovedEvent = new SerializableComponentRemovedEvent(
        // EntityID + ComponentType is unique, so it can be used to identify the component
        removedComponent.entityId,
        removedComponent.type
      )
      EventSystem.addNetworkEvent(componentRemovedEvent)
    }
  }
}
