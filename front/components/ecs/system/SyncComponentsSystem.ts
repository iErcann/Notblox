import { Entity } from "@shared/entity/Entity";
import {
  SerializedComponent,
  SerializedComponentType,
  SerializedEntity,
  SerializedEntityType,
  SnapshotMessage,
  SerializedPositionComponent,
  SerializedRotationComponent,
} from "@shared/network/server/serialized";

import { PositionComponent } from "@shared/component/PositionComponent";
import { RotationComponent } from "@shared/component/RotationComponent";
import { Game } from "@/components/game";
import { Player } from "../entity/Player";
import { Cube } from "../entity/Cube";

import { MeshComponent } from "../component/MeshComponent";

export class SyncComponentsSystem {
  constructor(public game: Game) {}
  update(entities: Entity[], snapshotMessage: SnapshotMessage) {
    const serializedEntities = snapshotMessage.e;
    serializedEntities.forEach((serializedEntity) => {
      // Find the replicated entity
      let entity = entities.find((entity) => entity.id === serializedEntity.id);

      if (!entity) {
        // If the entity doesn't exist, we create it
        entity = this.createEntity(serializedEntity)!;
      }

      // Find the replicated components
      const serializedComponents = serializedEntity.c;
      serializedComponents.forEach((serializedComponent) => {
        // We have to do the t! because NetworkData adds the type property after
        const component = entity!.getComponentByType(serializedComponent.t!);
        if (component) {
          // Deserialize the component (this updates the component)
          component.deserialize(serializedComponent);
        } else {
          // If the component doesn't exist, we create it
          entity!.addComponent(
            this.createComponent(serializedComponent, entity!.id)!
          );
        }
      });
    });
  }

  createEntity(serializedEntity: SerializedEntity) {
    if (serializedEntity.t === SerializedEntityType.PLAYER) {
      const player = new Player(serializedEntity.id);

      this.game.renderer.scene.add(
        player.entity.getComponent(MeshComponent)!.mesh
      );

      return player.entity;
    } else if (serializedEntity.t === SerializedEntityType.CUBE) {
      const cube = new Cube(serializedEntity.id);

      this.game.renderer.scene.add(
        cube.entity.getComponent(MeshComponent)!.mesh
      );

      return cube.entity;
    }
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
