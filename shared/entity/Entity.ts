import { SerializedComponentType, SerializedEntityType } from '../network/server/serialized.js'
import { Serializable, Component } from '../component/Component.js'
import { BaseEventSystem } from './EventSystem.js'

// Define an Entity class
export class Entity {
  components: Component[] = []

  constructor(public type: SerializedEntityType = SerializedEntityType.NONE, public id: number) {}

  // Add a component to the entity
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
  // Remove a component from the entity
  removeComponent<T extends Component>(
    componentType: new (entityId: number, ...args: any[]) => T
  ): void {
    this.components = this.components.filter((c) => !(c instanceof componentType))
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

  // This is used by the client only !
  // We assume that the clients will only have serializable components so they will have a type!
  getComponentBySerializedType(componentType: SerializedComponentType) {
    return this.components.find((c) => 'type' in c && c.type === componentType) as
      | Serializable
      | undefined
  }
}
