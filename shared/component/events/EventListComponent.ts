import { Component, ComponentConstructor } from '../Component.js'

/**
 * Holds a list of events, each of which is a component
 * @extends Component
 * @property {Map<ComponentConstructor, Component[]>} events  Map of event components
 * @example
 * // Create a new event list component
 * const eventListComponent = new EventListComponent(1)
 * // Add an event to the list
 * eventListComponent.addEvent(new MessageEvent(1, 'Player', 'Hello, world!'))
 * // Get all events in the list
 * const allEvents = eventListComponent.getAllEvents()
 * // Get an event of a certain type
 * const messages = eventListComponent.getEvents(MessageEvent)
 */
export class EventListComponent extends Component {
  events: Map<ComponentConstructor, Component[]> = new Map()

  constructor(entityId: number) {
    super(entityId)
  }

  /**
   * Add an event to the list
   * @param event  The event component to add
   */
  addEvent(event: Component): void {
    const componentType = event.constructor as ComponentConstructor
    if (!this.events.has(componentType)) {
      this.events.set(componentType, [])
    }
    this.events.get(componentType)!.push(event)
  }

  /**
   * Remove an event from the list
   * @param event  The event component to remove
   */
  removeEvent(event: Component): void {
    const componentType = event.constructor as ComponentConstructor
    const eventArray = this.events.get(componentType)
    if (eventArray) {
      this.events.set(
        componentType,
        eventArray.filter((e) => e !== event)
      )
      if (this.events.get(componentType)!.length === 0) {
        this.events.delete(componentType)
      }
    }
  }

  /**
   * Remove all events from the list
   */
  removeAllEvents(): void {
    this.events.clear()
  }

  /**
   * Get all events in the list
   * @returns Array of event components
   */
  getAllEvents(): Component[] {
    const allEvents: Component[] = []
    this.events.forEach((eventArray) => {
      allEvents.push(...eventArray)
    })
    return allEvents
  }

  /**
   * Get an event from the list
   * @param event The event component to get
   * @returns The event if it exists, otherwise undefined
   */
  getEvent(event: Component): Component | undefined {
    const componentType = event.constructor as ComponentConstructor
    const eventArray = this.events.get(componentType)
    return eventArray ? eventArray.find((e) => e === event) : undefined
  }

  /**
   * Get all events of a certain type
   * @param componentType The type of the event component to get
   * @returns Array of event components of the specified type
   */
  getEvents<T extends Component>(componentType: ComponentConstructor<T>): T[] {
    return (this.events.get(componentType) as T[]) || []
  }
}
