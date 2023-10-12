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
    private components: NetworkComponent[]
  ) {
    super(entityId);
  }
  deserialize(data: any): void {
    throw new Error("Method not implemented.");
  }

  getComponents(): NetworkComponent[] {
    return this.components;
  }

  serialize(serializeAll = false): SerializedEntity {
    const components = this.getComponents();
    const serializedComponents = components
      .filter((component) => serializeAll || component.isSent === true)
      .map((component: Serializable) => {
        return { t: component.type, ...component.serialize() };
      });

    const broadcastMessage = {
      id: this.entityId,
      t: this.entityType,
      c: serializedComponents,
    };

    // Convert BroadcastMessage to JSON and send it to clients
    return broadcastMessage;
  }
}
