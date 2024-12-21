import { Game } from '@/game/game.js'
import { Entity } from '@shared/entity/Entity.js'
import { SerializedEntityType } from '@shared/network/server/serialized.js'
import { FollowComponent } from '../component/FollowComponent.js'
import { CurrentPlayerComponent } from '../component/CurrentPlayerComponent.js'

export class IdentifyFollowedMeshSystem {
  update(entities: Entity[], game: Game) {
    for (const entity of entities) {
      if (entity.type === SerializedEntityType.PLAYER && entity.id === game.currentPlayerEntityId) {
        if (!entity.getComponent(CurrentPlayerComponent)) {
          entity.addComponent(new CurrentPlayerComponent(entity.id))
          entity.addComponent(new FollowComponent(entity.id, game.renderer.camera))
        }
      }
    }
  }
}
