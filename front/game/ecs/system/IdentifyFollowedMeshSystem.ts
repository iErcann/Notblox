import { Game } from '@/game/game'
import { Entity } from '@shared/entity/Entity'
import { SerializedEntityType } from '@shared/network/server/serialized'
import { FollowComponent } from '../component/FollowComponent'
import { TextComponent } from '../component/TextComponent'
import { MeshComponent } from '../component/MeshComponent'
export class IdentifyFollowedMeshSystem {
  private playerFound: boolean = false

  update(entities: Entity[], game: Game) {
    for (const entity of entities) {
      if (entity.type === SerializedEntityType.PLAYER) {
        const isCurrentPlayer = entity.id === game.currentPlayerEntityId

        if (isCurrentPlayer) {
          if (!this.playerFound) {
            entity.addComponent(new FollowComponent(entity.id, game.renderer.camera))
            this.playerFound = true
          }
        } else {
          const playerMesh = entity.getComponent(MeshComponent)
          // When a player is created, its mesh is not created yet
          // The ServerMeshComponent is created first, then
          // it loads the mesh and creates the MeshComponent
          // So, we need to wait for the MeshComponent to be created to add the FollowComponent
          if (!playerMesh) {
            continue
          }
          let textComponent = entity.getComponent(TextComponent)
          if (!textComponent) {
            textComponent = new TextComponent(entity.id, 'Player ' + entity.id)
            entity.addComponent(textComponent)
          }
          textComponent.setFollowedMesh(playerMesh.mesh)
        }
      }
    }
  }
}
