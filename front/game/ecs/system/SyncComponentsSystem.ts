import { Entity } from "@shared/entity/Entity";
import {
  SerializedComponent,
  SerializedComponentType,
  SerializedEntity,
  SerializedEntityType,
  SnapshotMessage,
  SerializedPositionComponent,
  SerializedRotationComponent,
  SerializedSizeComponent,
  SerializedDestroyedComponent,
  SerializedColorComponent,
  SerializedSingleSizeComponent,
  SerializedStateComponent,
} from "@shared/network/server/serialized";

import { PositionComponent } from "@shared/component/PositionComponent";
import { StateComponent } from "@shared/component/StateComponent";
import { EventDestroyedComponent } from "@shared/component/events/EventDestroyedComponent";
import { RotationComponent } from "@shared/component/RotationComponent";
import { SizeComponent } from "@shared/component/SizeComponent";
import { SingleSizeComponent } from "@shared/component/SingleSizeComponent";

import { Game } from "@/game/game";
import { Player } from "../entity/Player";
import { Cube } from "../entity/Cube";

import { MeshComponent } from "../component/MeshComponent";
import { ColorComponent } from "@shared/component/ColorComponent";
import { Sphere } from "../entity/Sphere";
import { NetworkComponent } from "@shared/network/NetworkComponent";

export class SyncComponentsSystem {
  constructor(public game: Game) {}
  update(entities: Entity[], snapshotMessage: SnapshotMessage) {
    const serializedEntities = snapshotMessage.e;
    for (const serializedEntity of serializedEntities) {
      // Find the replicated entity
      let entity = entities.find((entity) => entity.id === serializedEntity.id);

      if (!entity) {
        // If the entity doesn't exist, we create it
        const createdEntity = this.createEntity(serializedEntity);
        if (!createdEntity) {
          console.error("Can't create entity, add it to createEntity");
          continue;
        }
        entity = createdEntity;
      }

      // Find the replicated components
      const serializedComponents = serializedEntity.c;
      for (const serializedComponent of serializedComponents) {
        // We have to do the t! because NetworkData adds the type property after

        const component = entity.getComponentByType(serializedComponent.t!);
        if (component) {
          // Deserialize the component (this updates the component)
          component.deserialize(serializedComponent);
          (component as NetworkComponent).updated = true;
        } else {
          // If the component doesn't exist, we create it
          const createdComponent = this.createComponent(
            serializedComponent,
            entity.id
          );

          if (createdComponent) entity.addComponent(createdComponent);
          else
            console.error(
              "Can't create received component, add it to createComponent."
            );
        }
      }
    }
  }

  createEntity(serializedEntity: SerializedEntity) {
    if (serializedEntity.t === SerializedEntityType.PLAYER) {
      const player = new Player(serializedEntity.id, this.game);

      this.game.renderer.scene.add(
        player.entity.getComponent(MeshComponent)!.mesh
      );

      return player.entity;
    } else if (serializedEntity.t === SerializedEntityType.CUBE) {
      const cube = new Cube(serializedEntity.id, this.game);

      this.game.renderer.scene.add(
        cube.entity.getComponent(MeshComponent)!.mesh
      );

      return cube.entity;
    } else if (serializedEntity.t === SerializedEntityType.SPHERE) {
      const sphere = new Sphere(serializedEntity.id, this.game);

      this.game.renderer.scene.add(
        sphere.entity.getComponent(MeshComponent)!.mesh
      );

      return sphere.entity;
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
    } else if (serializedComponent.t === SerializedComponentType.SIZE) {
      const serializedSizeComponent =
        serializedComponent as SerializedSizeComponent;

      return new SizeComponent(
        entityId,
        serializedSizeComponent.width,
        serializedSizeComponent.height,
        serializedSizeComponent.depth
      );
    } else if (serializedComponent.t === SerializedComponentType.DESTROYED) {
      const serializedSizeComponent =
        serializedComponent as SerializedDestroyedComponent;

      return new EventDestroyedComponent(entityId);
    } else if (serializedComponent.t === SerializedComponentType.COLOR) {
      const serializedColorComponent =
        serializedComponent as SerializedColorComponent;
      return new ColorComponent(entityId, serializedColorComponent.color);
    } else if (serializedComponent.t === SerializedComponentType.SINGLE_SIZE) {
      const serializedSingleSizeComponent =
        serializedComponent as SerializedSingleSizeComponent;
      return new SingleSizeComponent(
        entityId,
        serializedSingleSizeComponent.size
      );
    } else if (serializedComponent.t === SerializedComponentType.STATE) {
      const serializedStateComponent =
        serializedComponent as SerializedStateComponent;
      return new StateComponent(entityId, serializedStateComponent.state);
    }
  }
}
