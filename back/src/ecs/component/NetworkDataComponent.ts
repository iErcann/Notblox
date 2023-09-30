import { SerializedComponentType } from "../../../../shared/serialized.js";
import { EntityEnum } from "../entity/entity.js";
import { Component, Serializable } from "./component.js";

export class NetworkDataComponent extends Component implements Serializable {
  type = SerializedComponentType.NONE;
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
      return { t: component.type, ...component.serialize() };
    });

    const networkData = {
      id: this.entityId,
      c: serializedComponents,
    };

    // Convert networkData to JSON and send it to clients
    return networkData;
  }
}
