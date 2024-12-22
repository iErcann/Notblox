import { ComponentAddedEvent } from '@shared/component/events/ComponentAddedEvent'
import { KeyInteractibleComponent } from '@shared/component/KeyInteractibleComponent'
import { Entity } from '@shared/entity/Entity'
import { EntityManager } from '@shared/system/EntityManager'
import { EventSystem } from '@shared/system/EventSystem'
import { MeshComponent } from '../component/MeshComponent'
import { Game } from '@/game/game'

export class KeyInteractibleSystem {
  update(entities: Entity[], game: Game) {
    // this.handleComponentAddedEvents(entities)
    // this.updateInteractibleHighlights(entities, game)
  }

  // private handleComponentAddedEvents(entities: Entity[]) {
  //   const createEvents = EventSystem.getEventsWrapped(ComponentAddedEvent, KeyInteractibleComponent)
  //   for (const event of createEvents) {
  //     const entity = EntityManager.getEntityById(entities, event.entityId)
  //     if (!entity) continue
  //     console.log('Interactible component added', entity)

  //     const textComponent = new TextComponent(entity.id, '(E) SHOOT')
  //     entity.addComponent(textComponent)

  //     const meshComponent = entity.getComponent(MeshComponent)
  //     if (meshComponent) {
  //       textComponent.setFollowedMesh(meshComponent.mesh)
  //     }
  //   }
  // }

  // private updateInteractibleHighlights(entities: Entity[], game: Game) {
  //   const currentPlayer = entities.find((entity) => entity.id === game.currentPlayerEntityId)
  //   if (!currentPlayer) return

  //   console.log('Checking for interactible', currentPlayer)

  //   entities.forEach((otherEntity) => {
  //     const keyInteractible = otherEntity.getComponent(KeyInteractibleComponent)
  //     const textComponent = otherEntity.getComponent(TextComponent)

  //     if (keyInteractible && textComponent) {
  //       //textComponent.textObject.element.style.backgroundColor = '#111111'
  //     }
  //   })
  // }
}
