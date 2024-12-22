import { ComponentAddedEvent } from '@shared/component/events/ComponentAddedEvent'
import { ComponentRemovedEvent } from '@shared/component/events/ComponentRemovedEvent'
import { Entity } from '@shared/entity/Entity'
import { EntityManager } from '@shared/system/EntityManager'
import { EventSystem } from '@shared/system/EventSystem'
import { CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer.js'
import { TextComponent } from '@shared/component/TextComponent'
import { MeshComponent } from '../component/MeshComponent'
import { CurrentPlayerComponent } from '../component/CurrentPlayerComponent'
import { PositionComponent } from '@shared/component/PositionComponent'
import { Game } from '@/game/game'
import * as THREE from 'three'

export class TextComponentSystem {
  private textObjects: Map<number, CSS2DObject> = new Map()

  // Default styles for text elements
  private static readonly DEFAULT_STYLES: Record<string, string> = {
    color: '#FFFFFF',
    backgroundColor: 'rgba(0, 0, 0, .2)',
    padding: '5px',
    fontFamily: 'Arial, sans-serif',
    fontSize: '14px',
  }

  update(entities: Entity[]) {
    this.handleAddedComponents(entities)
    this.handleRemovedComponents()
    this.updateExistingComponents(entities)
  }

  private applyStyles(element: HTMLDivElement, styles: Record<string, string> = {}): void {
    Object.assign(element.style, TextComponentSystem.DEFAULT_STYLES, styles)
  }
  private createTextObject(textComponent: TextComponent): CSS2DObject {
    const textElement = document.createElement('div')
    textElement.textContent = textComponent.text

    // Apply default styles
    this.applyStyles(textElement)

    const textObject = new CSS2DObject(textElement)
    this.updateTextObjectPosition(textObject, textComponent)
    return textObject
  }

  private updateTextObjectPosition(
    textObject: CSS2DObject,
    textComponent: TextComponent,
    positionComponent?: PositionComponent
  ): void {
    const x = (positionComponent?.x ?? 0) + textComponent.offsetX
    const y = (positionComponent?.y ?? 0) + textComponent.offsetY
    const z = (positionComponent?.z ?? 0) + textComponent.offsetZ
    textObject.position.set(x, y, z)
  }

  private handleAddedComponents(entities: Entity[]): void {
    const createdEvents = EventSystem.getEventsWrapped(ComponentAddedEvent, TextComponent)

    for (const event of createdEvents) {
      const entity = EntityManager.getEntityById(entities, event.entityId)
      if (!entity) {
        console.error('TextComponentSystem: Entity not found', event.entityId)
        continue
      }

      const currentPlayerComponent = entity.getComponent(CurrentPlayerComponent)
      if (currentPlayerComponent) {
        // Ignore the current player text
        continue
      }

      const textObject = this.createTextObject(event.component)
      this.textObjects.set(entity.id, textObject)

      // Attach to mesh if available and not the current player
      const meshComponent = entity.getComponent(MeshComponent)

      // Since some entities will not have a mesh, we will follow their position component in the update loop
      const parent = meshComponent?.mesh ?? Game.getInstance().renderer.scene
      parent.add(textObject)
    }
  }

  private handleRemovedComponents() {
    const removedEvents = EventSystem.getEventsWrapped(ComponentRemovedEvent, TextComponent)

    for (const event of removedEvents) {
      const textObject = this.textObjects.get(event.entityId)
      if (textObject) {
        textObject.element.remove()
        textObject.removeFromParent() // Remove from mesh if attached
        this.textObjects.delete(event.entityId)
      }
    }
  }

  private updateExistingComponents(entities: Entity[]): void {
    const currentPlayerEntity = EntityManager.getFirstEntityWithComponent(
      entities,
      CurrentPlayerComponent
    )

    for (const entity of entities) {
      const textComponent = entity.getComponent(TextComponent)
      const textObject = this.textObjects.get(entity.id)

      if (!textObject || !textComponent) continue

      // Update text content if changed
      if (textComponent.updated) {
        textObject.element.textContent = textComponent.text
        this.updateTextObjectPosition(textObject, textComponent)
      }

      // Update position for entities without mesh
      if (!entity.getComponent(MeshComponent)) {
        const positionComponent = entity.getComponent(PositionComponent)
        if (positionComponent) {
          this.updateTextObjectPosition(textObject, textComponent, positionComponent)
        }
      }

      // Update visibility based on distance to player
      if (currentPlayerEntity) {
        this.updateVisibility(entity, currentPlayerEntity)
      }
    }
  }

  private updateVisibility(entityWithText: Entity, currentPlayerEntity: Entity): void {
    const textObject = this.textObjects.get(entityWithText.id)
    const position = entityWithText.getComponent(PositionComponent)
    const textComponent = entityWithText.getComponent(TextComponent)
    const playerPosition = currentPlayerEntity.getComponent(PositionComponent)

    if (!textObject || !position || !textComponent || !playerPosition) return

    const distance = this.calculateDistance(position, playerPosition)

    textObject.visible = distance <= textComponent.displayDistance
  }

  private calculateDistance(pos1: PositionComponent, pos2: PositionComponent): number {
    return new THREE.Vector3(pos1.x, pos1.y, pos1.z).distanceTo(
      new THREE.Vector3(pos2.x, pos2.y, pos2.z)
    )
  }
}
