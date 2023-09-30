import { Entity } from "@shared/entity/Entity";
import {
  SerializedComponent,
  SerializedComponentType,
  SerializedEntity,
  SerializedPositionComponent,
  SerializedRotationComponent,
} from "@shared/serialized";

import { PositionComponent } from "@shared/component/PositionComponent";
import { RotationComponent } from "@shared/component/RotationComponent";

class SerializedComponentSystem {
  update(entities: Entity[], serializedEntities: SerializedEntity[]) {
    serializedEntities.forEach((serializedEntity) => {
      // Find the replicated entity
      const entity = entities.find(
        (entity) => entity.id === serializedEntity.id
      );

      if (entity) {
        // Find the replicated components
        const serializedComponents = serializedEntity.c;
        serializedComponents.forEach((serializedComponent) => {
          // We have to do the t! because NetworkDataComponent adds the type property after
          const component = entity.getComponentByType(serializedComponent.t!);
          if (component) {
            // Deserialize the component (this updates the component)
            component.deserialize(serializedComponent);
          } else {
            // If the component doesn't exist, we create it
            entity.addComponent(
              this.createComponent(serializedComponent, entity.id)!
            );
          }
        });
      }
    });
  }

  createComponent(serializedComponent: SerializedComponent, entityId: number) {
    if (serializedComponent.t === SerializedComponentType.POSITION) {
      const serializedPositionComponent =
        serializedComponent as SerializedPositionComponent;
      return new PositionComponent(
        entityId,
        serializedPositionComponent.x,
        serializedPositionComponent.y,
        serializedPositionComponent.z
      );
    } else if (serializedComponent.t === SerializedComponentType.ROTATION) {
      const serializedRotationComponent =
        serializedComponent as SerializedRotationComponent;
      return new RotationComponent(
        entityId,
        serializedRotationComponent.x,
        serializedRotationComponent.y,
        serializedRotationComponent.z,
        serializedRotationComponent.w
      );
    }
  }
}
