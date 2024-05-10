import {
  SerializedComponentType,
  SerializedEntityType,
} from "../network/server/serialized.js";
import { Serializable, Component } from "../component/Component.js";

// Define an Entity class
export class Entity {
  private static nextId = 1;
  public components: Component[] = [];

  constructor(public type: SerializedEntityType, public id: number) {}

  // Add a component to the entity
  addComponent(component: Component) {
    this.components.push(component);
  }

  // Remove a component from the entity

  removeComponent<T extends Component>(
    componentType: new (entityId: number, ...args: any[]) => T
  ): void {
    this.components = this.components.filter(
      (c) => !(c instanceof componentType)
    );
  }
  getAllComponents() {
    return this.components;
  }

  // Get a component from the entity
  getComponent<T extends Component>(
    componentType: new (entityId: number, ...args: any[]) => T
  ): T | undefined {
    return this.components.find((c) => c instanceof componentType) as
      | T
      | undefined;
  }
  // Get all components of a certain type
  getComponents<T extends Component>(
    componentType: new (entityId: number, ...args: any[]) => T
  ): T[] {
    return this.components.filter((c) => c instanceof componentType) as T[];
  }

  // This is used by the client only !
  // We assume that the clients will only have serializable component so they will have a type!
  getComponentByType(componentType: SerializedComponentType) {
    return this.components.find(
      (c) => "type" in c && c.type === componentType
    ) as Serializable | undefined;
  }
}
