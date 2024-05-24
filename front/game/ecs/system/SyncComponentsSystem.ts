import { Game } from '@/game/game'
import { Entity } from '@shared/entity/Entity'
import { Cube } from '../entity/Cube'
import { Player } from '../entity/Player'

import {
  SerializedComponent,
  SerializedComponentType,
  SerializedEntity,
  SerializedEntityType,
  SerializedStateType,
  SnapshotMessage,
} from '@shared/network/server/serialized'

import { ChatListComponent } from '@shared/component/ChatComponent'
import { ColorComponent } from '@shared/component/ColorComponent'
import { PositionComponent } from '@shared/component/PositionComponent'
import { RotationComponent } from '@shared/component/RotationComponent'
import { SingleSizeComponent } from '@shared/component/SingleSizeComponent'
import { SizeComponent } from '@shared/component/SizeComponent'
import { StateComponent } from '@shared/component/StateComponent'
import { EntityDestroyedEvent } from '@shared/component/events/EntityDestroyedEvent'
import { MeshComponent } from '../component/MeshComponent'

import { NetworkComponent } from '@shared/network/NetworkComponent'
import { Chat } from '../entity/Chat'
import { Sphere } from '../entity/Sphere'

export class SyncComponentsSystem {
  constructor(public game: Game) {}
  update(entities: Entity[], snapshotMessage: SnapshotMessage) {
    const serializedEntities = snapshotMessage.e
    for (const serializedEntity of serializedEntities) {
      // Find the replicated entity
      let entity = entities.find((entity) => entity.id === serializedEntity.id)

      if (!entity) {
        // If the entity doesn't exist, we create it
        const createdEntity = this.createEntity(serializedEntity)
        if (!createdEntity) {
          console.error("Can't create entity, add it to createEntity")
          continue
        }
        entity = createdEntity
      }

      // Find the replicated components
      const serializedComponents = serializedEntity.c
      for (const serializedComponent of serializedComponents) {
        // We have to do the t! because NetworkData adds the type property after

        const component = entity.getComponentBySerializedType(serializedComponent.t!)
        if (component) {
          // Deserialize the component (this updates the component)
          component.deserialize(serializedComponent)
          ;(component as NetworkComponent).updated = true
        } else {
          // If the component doesn't exist, we create it
          const createdComponent = this.createComponent(serializedComponent, entity.id)

          if (createdComponent) entity.addComponent(createdComponent)
          else console.error("Can't create received component, add it to createComponent.")
        }
      }
    }
  }

  createEntity(serializedEntity: SerializedEntity) {
    if (serializedEntity.t === SerializedEntityType.PLAYER) {
      const player = new Player(serializedEntity.id, this.game)

      this.game.renderer.scene.add(player.entity.getComponent(MeshComponent)!.mesh)

      return player.entity
    } else if (serializedEntity.t === SerializedEntityType.CUBE) {
      const cube = new Cube(serializedEntity.id, this.game)

      this.game.renderer.scene.add(cube.entity.getComponent(MeshComponent)!.mesh)

      return cube.entity
    } else if (serializedEntity.t === SerializedEntityType.SPHERE) {
      const sphere = new Sphere(serializedEntity.id, this.game)

      this.game.renderer.scene.add(sphere.entity.getComponent(MeshComponent)!.mesh)

      return sphere.entity
    } else if (serializedEntity.t === SerializedEntityType.CHAT) {
      return new Chat(serializedEntity.id, this.game).entity
    }
  }
  createComponent(serializedComponent: SerializedComponent, entityId: number) {
    let createdComponent: NetworkComponent | undefined = undefined
    if (serializedComponent.t === SerializedComponentType.POSITION) {
      createdComponent = new PositionComponent(entityId, 1, 1, 1)
    } else if (serializedComponent.t === SerializedComponentType.ROTATION) {
      createdComponent = new RotationComponent(entityId, 1, 1, 1, 1)
    } else if (serializedComponent.t === SerializedComponentType.SIZE) {
      createdComponent = new SizeComponent(entityId, 1, 1, 1)
    } else if (serializedComponent.t === SerializedComponentType.DESTROYED) {
      createdComponent = new EntityDestroyedEvent(entityId)
    } else if (serializedComponent.t === SerializedComponentType.COLOR) {
      createdComponent = new ColorComponent(entityId, '0xffffff')
    } else if (serializedComponent.t === SerializedComponentType.SINGLE_SIZE) {
      createdComponent = new SingleSizeComponent(entityId, 0)
    } else if (serializedComponent.t === SerializedComponentType.STATE) {
      createdComponent = new StateComponent(entityId, SerializedStateType.IDLE)
    } else if (serializedComponent.t === SerializedComponentType.CHAT_LIST) {
      createdComponent = new ChatListComponent(entityId, [])
    }
    if (createdComponent) {
      createdComponent.deserialize(serializedComponent)
    }
    return createdComponent
  }
}
