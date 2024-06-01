import { Game } from '@/game/game'
import { Entity } from '@shared/entity/Entity'
import { Cube } from '../entity/Cube'
import { Player } from '../entity/Player'
import { Sphere } from '../entity/Sphere'
import { Chat } from '../entity/Chat'

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
import { BaseEventSystem } from '@shared/system/EventSystem'
import { EventListComponent } from '@shared/component/events/EventListComponent'

export class SyncComponentsSystem {
  private snapshotMessages: SnapshotMessage[] = []
  constructor(public game: Game) {}
  addSnapshotMessage(snapshotMessage: SnapshotMessage) {
    this.snapshotMessages.push(snapshotMessage)
  }
  handleEventEntity(serializedEventQueueEntity: SerializedEntity) {
    const eventEntity = BaseEventSystem.getInstance().eventQueue.entity
    const eventListComponent = eventEntity.getComponent(EventListComponent)

    for (const serializedComponent of serializedEventQueueEntity.c) {
      const eventComponent = this.createComponent(serializedComponent, eventEntity.id)
      if (!eventComponent) {
        console.error(
          "Can't create event component, add it to createComponent",
          serializedComponent
        )
        continue
      }
      eventListComponent?.addEvent(eventComponent)
    }
  }
  update(entities: Entity[]) {
    for (const [index, snapshotMessage] of this.snapshotMessages.entries()) {
      const serializedEntities = snapshotMessage.e
      for (const serializedEntity of serializedEntities) {
        // The EventQueue entity already exist on the client (BaseEventSystem instance constructor creates it), we don't need to create it
        // We  need to handle the events by adding them to the event queue on the BaseEventSystem instance
        if (serializedEntity.t === SerializedEntityType.EVENT_QUEUE) {
          this.handleEventEntity(serializedEntity)
          continue
        }

        let entity = entities.find((entity) => entity.id === serializedEntity.id)

        if (!entity) {
          entity = this.createEntity(serializedEntity)
          if (!entity) {
            console.error("Can't create entity, add it to createEntity")
            return
          }
        }

        for (const serializedComponent of serializedEntity.c) {
          this.updateOrCreateComponent(entity!, serializedComponent)
        }
      }
      // Remove the processed snapshotMessage from the array
      this.snapshotMessages.splice(index, 1)
    }
  }

  updateOrCreateComponent(entity: Entity, serializedComponent: SerializedComponent) {
    // Find the replicated components
    const component = entity.getNetworkComponentBySerializedType(serializedComponent.t!)

    if (component) {
      // If the NetworkComponent exists, we update it
      const networkComponent = component as NetworkComponent
      networkComponent.deserialize(serializedComponent)
      networkComponent.updated = true
    } else {
      // If the NetworkComponent doesn't exist, create it
      const newComponent = this.createComponent(serializedComponent, entity.id)
      if (newComponent) {
        entity.addComponent(newComponent)
      } else {
        console.error(
          `Can't create received NetworkComponent of type ${serializedComponent.t}, add it to the createComponent function.`
        )
      }
    }
  }

  createEntity(serializedEntity: SerializedEntity): Entity | undefined {
    let newEntity: Entity | undefined

    switch (serializedEntity.t) {
      case SerializedEntityType.PLAYER:
        const player = new Player(serializedEntity.id, this.game)
        newEntity = player.entity
        this.game.renderer.scene.add(player.entity.getComponent(MeshComponent)!.mesh)
        break
      case SerializedEntityType.CUBE:
        const cube = new Cube(serializedEntity.id, this.game)
        newEntity = cube.entity
        this.game.renderer.scene.add(cube.entity.getComponent(MeshComponent)!.mesh)
        break
      case SerializedEntityType.SPHERE:
        const sphere = new Sphere(serializedEntity.id, this.game)
        newEntity = sphere.entity
        this.game.renderer.scene.add(sphere.entity.getComponent(MeshComponent)!.mesh)
        break
      case SerializedEntityType.CHAT:
        newEntity = new Chat(serializedEntity.id, this.game).entity
        break
      case SerializedEntityType.EVENT_QUEUE:
        newEntity = BaseEventSystem.getInstance().eventQueue.entity
        break
      default:
        console.error("Unknown entity type, can't create entity")
    }

    return newEntity
  }

  createComponent(
    serializedComponent: SerializedComponent,
    entityId: number
  ): NetworkComponent | undefined {
    let component: NetworkComponent | undefined

    switch (serializedComponent.t) {
      case SerializedComponentType.POSITION:
        component = new PositionComponent(entityId, 1, 1, 1)
        break
      case SerializedComponentType.ROTATION:
        component = new RotationComponent(entityId, 1, 1, 1, 1)
        break
      case SerializedComponentType.SIZE:
        component = new SizeComponent(entityId, 1, 1, 1)
        break
      case SerializedComponentType.DESTROYED_EVENT:
        component = new EntityDestroyedEvent(entityId)
        break
      case SerializedComponentType.COLOR:
        component = new ColorComponent(entityId, '0xffffff')
        break
      case SerializedComponentType.SINGLE_SIZE:
        component = new SingleSizeComponent(entityId, 0)
        break
      case SerializedComponentType.STATE:
        component = new StateComponent(entityId, SerializedStateType.IDLE)
        break
      case SerializedComponentType.CHAT_LIST:
        component = new ChatListComponent(entityId, [])
        break
      default:
        console.error("Unknown component type, can't create component")
    }

    component?.deserialize(serializedComponent)
    return component
  }
}
