import { SerializedComponentType, SerializedEntityType } from '../network/server/serialized.js'
import { Serializable, Component } from '../component/Component.js'
import { BaseEventSystem } from '../system/EventSystem.js'
import { EntityManager } from './EntityManager.js'

// Define an Entity class
export class Entity {
  components: Component[] = []

  constructor(public type: SerializedEntityType = SerializedEntityType.NONE, public id: number) {}

  /**
   * Add a component to the entity
   * @param component  The component to add
   * @param createAddedEvent  Whether to create an added event or not, default is true, useful for skipping recursion
   */
  addComponent<T extends Component>(component: T, createAddedEvent = true) {
    this.components.push(component)

    // This can be used to skip the recursion or non added events
    if (createAddedEvent) {
      BaseEventSystem.onComponentAdded(component)
    }
  }

  // Remove all components using the remove component function
  removeAllComponents() {
    this.components.forEach((c) =>
      this.removeComponent(c.constructor as new (...args: any[]) => Component)
    )
  }
  /**
   * Remove a component from the entity
   * @param component  The component to add
   * @param createRemoveEvent  Whether to create an added event or not, default is true, useful for skipping recursion
   */
  removeComponent<T extends Component>(
    componentType: new (entityId: number, ...args: any[]) => T,
    createRemoveEvent = true
  ): void {
    let removedComponent: T | null = null

    this.components = this.components.filter((c) => {
      if (c instanceof componentType) {
        removedComponent = c
        return false
      }
      return true
    })

    if (createRemoveEvent && removedComponent) {
      BaseEventSystem.onComponentRemoved(removedComponent)
    }
  }

  getAllComponents() {
    return this.components
  }

  // Get a component from the entity
  getComponent<T extends Component>(
    componentType: new (entityId: number, ...args: any[]) => T
  ): T | undefined {
    return this.components.find((c) => c instanceof componentType) as T | undefined
  }
  // Get all components of a certain type
  getComponents<T extends Component>(
    componentType: new (entityId: number, ...args: any[]) => T
  ): T[] {
    return this.components.filter((c) => c instanceof componentType) as T[]
  }

  // TODO: Remove the Serializable interface, put the NetworkComponent as abstract
  // This is used by the client only !
  // We assume that the clients will only have serializable components so they will have a type!
  getComponentBySerializedType(componentType: SerializedComponentType) {
    return this.components.find((c) => 'type' in c && c.type === componentType) as
      | Serializable
      | undefined
  }
}
