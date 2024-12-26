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
import { ProximityPromptComponent } from '@shared/component/ProximityPromptComponent'

export class TextComponentSystem {
  private textObjects: WeakMap<TextComponent, CSS2DObject> = new WeakMap()

  // Default styles for text elements
  private static readonly DEFAULT_STYLES: Record<string, string> = {
    color: '#FFFFFF',
    backgroundColor: 'rgba(0, 0, 0, .2)',
    padding: '5px',
    fontFamily: 'Arial, sans-serif',
    fontSize: '14px',
  }

  update(entities: Entity[]) {
    const currentPlayerEntity = entities.find((entity) =>
      entity.getComponent(CurrentPlayerComponent)
    )
    if (!currentPlayerEntity) return
    this.handleAddedComponents(entities)
    this.handleRemovedComponents()
    this.processEntities(entities, currentPlayerEntity)
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
    const createdEvents: ComponentAddedEvent<TextComponent>[] = EventSystem.getEventsWrapped(
      ComponentAddedEvent,
      TextComponent
    )

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
      this.textObjects.set(event.component, textObject)

      // Attach to mesh if available and not the current player
      const meshComponent = entity.getComponent(MeshComponent)

      // Since some entities will not have a mesh, we will follow their position component in the update loop
      const parent = meshComponent?.mesh ?? Game.getInstance().renderer.scene
      parent.add(textObject)
    }

    const createdProximityPromptEvents: ComponentAddedEvent<ProximityPromptComponent>[] =
      EventSystem.getEventsWrapped(ComponentAddedEvent, ProximityPromptComponent)
    for (const event of createdProximityPromptEvents) {
      const entity = EntityManager.getEntityById(entities, event.entityId)
      if (!entity) {
        console.error('TextComponentSystem: Entity not found', event.entityId)
        continue
      }

      const proximityPromptComponent = event.component
      const textComponent = proximityPromptComponent.textComponent

      const textObject = this.createTextObject(textComponent)
      this.textObjects.set(textComponent, textObject)

      // Attach to mesh if available
      const meshComponent = entity.getComponent(MeshComponent)
      const parent = meshComponent?.mesh ?? Game.getInstance().renderer.scene
      parent.add(textObject)
    }
  }

  private handleRemovedComponents() {
    const removedEvents: ComponentRemovedEvent<TextComponent>[] = EventSystem.getEventsWrapped(
      ComponentRemovedEvent,
      TextComponent
    )

    for (const event of removedEvents) {
      const textObject = this.textObjects.get(event.component)
      if (textObject) {
        textObject.element.remove()
        textObject.removeFromParent() // Remove from mesh if attached
        this.textObjects.delete(event.component)
      }
    }

    const removedKeyInteractEvents: ComponentRemovedEvent<ProximityPromptComponent>[] =
      EventSystem.getEventsWrapped(ComponentRemovedEvent, ProximityPromptComponent)
    for (const event of removedKeyInteractEvents) {
      const textObject = this.textObjects.get(event.component.textComponent)
      if (textObject) {
        textObject.element.remove()
        textObject.removeFromParent() // Remove from mesh if attached
        this.textObjects.delete(event.component.textComponent)
      }
    }
  }

  /**
   * TextComponent is shown when the entity is within the display distance
   * ProximityPromptComponent has a TextComponent (E.g "Press E to interact")
   */
  private processEntities(entities: Entity[], currentPlayerEntity: Entity): void {
    for (const entity of entities) {
      const textComponent = entity.getComponent(TextComponent)
      if (textComponent) {
        this.processTextComponent(entity, textComponent, currentPlayerEntity)
      }
      const proximityPromptComponent = entity.getComponent(ProximityPromptComponent)
      if (proximityPromptComponent) {
        this.processTextComponent(
          entity,
          proximityPromptComponent.textComponent,
          currentPlayerEntity
        )
      }
    }
  }

  private processTextComponent(
    entity: Entity,
    textComponent: TextComponent,
    currentPlayerEntity: Entity
  ): void {
    if (!textComponent) return

    const textObject = this.textObjects.get(textComponent)
    if (!textObject) return

    if (textComponent.updated) {
      textObject.element.textContent = textComponent.text
      this.updateTextObjectPosition(textObject, textComponent)
    }

    if (!entity.getComponent(MeshComponent)) {
      const positionComponent = entity.getComponent(PositionComponent)
      if (positionComponent) {
        this.updateTextObjectPosition(textObject, textComponent, positionComponent)
      }
    }

    if (currentPlayerEntity) {
      this.updateVisibility(entity, currentPlayerEntity, textComponent)
    }
  }

  private updateVisibility(
    entityWithText: Entity,
    currentPlayerEntity: Entity,
    textComponent: TextComponent
  ): void {
    const textObject = this.textObjects.get(textComponent)

    if (!textObject) return

    const position = entityWithText.getComponent(PositionComponent)
    const playerPosition = currentPlayerEntity.getComponent(PositionComponent)

    if (!textObject || !position || !playerPosition) return

    const distance = this.calculateDistance(position, playerPosition)

    textObject.visible = distance <= textComponent.displayDistance
  }

  private calculateDistance(pos1: PositionComponent, pos2: PositionComponent): number {
    return new THREE.Vector3(pos1.x, pos1.y, pos1.z).distanceTo(
      new THREE.Vector3(pos2.x, pos2.y, pos2.z)
    )
  }
}
