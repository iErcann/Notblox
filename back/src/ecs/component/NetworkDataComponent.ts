import { EntityEnum } from "../entity/entity.js";
import { Component, Serializable } from "./component.js";

export class NetworkDataComponent extends Component implements Serializable {
  constructor(
    entityId: number,
    public entityType: EntityEnum,
    private components: Serializable[]
  ) {
    super(entityId);
  }

  getComponents(): Serializable[] {
    return this.components;
  }

  serialize() {
    const components = this.getComponents();
    const serializedComponents = components.map((component) => {
      // Serialize each component (you can define serialization logic for each component type)
      return component.serialize();
    });

    const networkData = {
      type: this.entityType,
      id: this.entityId,
      components: serializedComponents,
    };

    // Convert networkData to JSON and send it to clients
    return networkData;
  }
}
