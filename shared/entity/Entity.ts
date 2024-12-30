import { SerializedComponentType, SerializedEntityType } from '../network/server/serialized.js'
import { Component, ComponentConstructor } from '../component/Component.js'
import { EventSystem } from '../system/EventSystem.js'
import { NetworkComponent } from '../../shared/network/NetworkComponent.js'

// Define an Entity class
export class Entity {
  components: Map<ComponentConstructor, Component> = new Map()

  constructor(public type: SerializedEntityType = SerializedEntityType.NONE, public id: number) {}

  /**
   * Add a component to the entity
   * @param component  The component to add
   * @param createAddedEvent  Whether to create an added event or not, default is true, useful for skipping recursion
   */
  addComponent<T extends Component>(component: T, createAddedEvent = true) {
    this.components.set(component.constructor as ComponentConstructor, component)

    // This can be used to skip the recursion or non added events
    if (createAddedEvent) {
      EventSystem.onComponentAdded(component)
    }
  }

  // Remove all components using the remove component function
  removeAllComponents() {
    Array.from(this.components.keys()).forEach((componentType) =>
      this.removeComponent(componentType)
    )
  }

  /**
   * Remove a component from the entity
   * @param componentType  The type of component to remove
   * @param createRemoveEvent  Whether to create a remove event or not, default is true, useful for skipping recursion
   */
  removeComponent(componentType: ComponentConstructor, createRemoveEvent = true): void {
    const removedComponent = this.components.get(componentType)
    if (removedComponent) {
      this.components.delete(componentType)
      if (createRemoveEvent) {
        EventSystem.onComponentRemoved(removedComponent)
      }
    }
  }

  getAllComponents(): Component[] {
    return Array.from(this.components.values())
  }

  // Get a component from the entity
  getComponent<T extends Component>(componentType: ComponentConstructor<T>): T | undefined {
    return this.components.get(componentType) as T | undefined
  }

  // This is used by the client only!
  getNetworkComponentBySerializedType(
    componentType: SerializedComponentType
  ): NetworkComponent | undefined {
    // Find NetworkComponent by type
    for (const component of this.components.values()) {
      if (component instanceof NetworkComponent && component.type === componentType) {
        return component as NetworkComponent
      }
    }
    console.error('NetworkComponent not found by type', componentType)
    return undefined
  }
}
