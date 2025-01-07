import { SerializedComponentType, SerializedEntityType } from '../network/server/serialized.js'
import { Component, ComponentConstructor } from '../component/Component.js'
import { EventSystem } from '../system/EventSystem.js'
import { NetworkComponent } from '../network/NetworkComponent.js'
import { NetworkDataComponent } from '../network/NetworkDataComponent.js'
import { config } from '../network/config.js'

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

  /**
   * Add a network component to the entity
   * Also add the event to the NetworkDataComponent so it can be sent to the client and replicated
   * @param component  The network component to add
   * @param createAddedEvent  Whether to create an added event or not, default is true, useful for skipping recursion
   */
  addNetworkComponent<T extends NetworkComponent>(component: T, createAddedEvent = true) {
    const networkDataComponent = this.getComponent(NetworkDataComponent)
    if (!networkDataComponent) {
      console.error("Can't add a network component, NetworkDataComponent not found on", this)
      return
    }
    networkDataComponent.addComponent(component)
    this.addComponent(component, createAddedEvent)
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
        console.log('Removing component', removedComponent)
        EventSystem.onComponentRemoved(removedComponent)
        // If we are on the server, remove the component from the NetworkDataComponent
        if (config.IS_SERVER) {
          const networkDataComponent = this.getComponent(NetworkDataComponent)
          if (networkDataComponent) {
            networkDataComponent.removeComponent(
              removedComponent.constructor as typeof NetworkComponent
            )
          }
        }
      }
    }
  }

  /**
   * Get all components from the entity
   * @returns An array of components
   */
  getAllComponents(): Component[] {
    return Array.from(this.components.values())
  }

  /**
   * Get a component from the entity
   * @param componentType  The type of component to get
   * @returns The component or undefined if it doesn't exist
   * @example
   * const positionComponent = entity.getComponent(PositionComponent)
   */
  getComponent<T extends Component>(componentType: ComponentConstructor<T>): T | undefined {
    return this.components.get(componentType) as T | undefined
  }

  /**
   * Used by the client only, to get a network component by its serialized type (SerializedComponentType)
   * Since component are unique, this is a simple way to get a component by its type
   * @param componentType  The serialized type of component to get
   * @returns The component or undefined if it doesn't exist
   * @example
   * const positionComponent = entity.getNetworkComponentBySerializedType(SerializedComponentType.POSITION)
   */
  getNetworkComponentBySerializedType(
    componentType: SerializedComponentType
  ): NetworkComponent | undefined {
    // Find NetworkComponent by type
    for (const component of this.components.values()) {
      if (component instanceof NetworkComponent && component.type === componentType) {
        return component as NetworkComponent
      }
    }
    return undefined
  }
}
