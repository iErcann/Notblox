import {
  SerializedComponentType,
  SerializedEntity,
  SerializedEntityType,
} from "../../../../shared/network/server/serialized.js";
import {
  Component,
  Serializable,
} from "../../../../shared/component/Component.js";
import { NetworkComponent } from "shared/network/NetworkComponent.js";

export class NetworkDataComponent extends Component implements Serializable {
  type = SerializedComponentType.NONE;

  constructor(
    entityId: number,
    public entityType: SerializedEntityType,
    public components: NetworkComponent[]
  ) {
    super(entityId);
  }
  deserialize(data: any): void {
    throw new Error("Method not implemented.");
  }

  getComponents(): NetworkComponent[] {
    return this.components;
  }

  removeComponent(componentType: typeof NetworkComponent) {
    this.components = this.components.filter(
      (c) => !(c instanceof componentType)
    );
  }

  // Add a component to the entity
  addComponent(component: NetworkComponent) {
    this.components.push(component);
  }

  serialize(serializeAll = false): SerializedEntity | null {
    const components = this.getComponents();
    const serializedComponents = components
      .filter((component) => serializeAll || component.updated === true)
      .map((component: Serializable) => {
        return { t: component.type, ...component.serialize() };
      });

    if (serializedComponents.length === 0) {
      return null;
    }

    const broadcastMessage = {
      id: this.entityId,
      t: this.entityType,
      c: serializedComponents,
    };

    return broadcastMessage;
  }
}
