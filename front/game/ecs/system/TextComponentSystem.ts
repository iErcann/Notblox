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

/**
 * TextComponent is shown when the entity is within the display distance
 * ProximityPromptComponent has a TextComponent (E.g "Press E to interact")
 */
export class TextComponentSystem {
  private textObjects: WeakMap<TextComponent, CSS2DObject> = new WeakMap()
  // Throttle visibility check & text updates to once per second
  private elapsedTime: number = 0 // Accumulator for delta time in milliseconds
  private updateInterval: number = 1000 / 2 // We want only two updates per second

  update(entities: Entity[], dt: number) {
    const currentPlayerEntity = EntityManager.getFirstEntityWithComponent(
      entities,
      CurrentPlayerComponent
    )
    if (!currentPlayerEntity) return
    this.elapsedTime += dt

    this.handleAddedComponents(entities)
    this.handleRemovedComponents()
    this.processEntities(entities, currentPlayerEntity)

    if (this.elapsedTime > this.updateInterval) {
      this.elapsedTime = 0
    }
  }

  private createTextObject(
    textComponent: TextComponent,
    positionComponent: PositionComponent,
    isProximityPrompt: boolean = false
  ): CSS2DObject {
    const textElement = document.createElement('div')
    this.updateTextElementContent(textElement, textComponent, isProximityPrompt)
    const textObject = new CSS2DObject(textElement)
    this.updateTextObjectPosition(textObject, textComponent, positionComponent)
    return textObject
  }

  private updateTextElementContent(
    textElement: HTMLElement,
    textComponent: TextComponent,
    isProximityPrompt: boolean
  ) {
    function sanitize(input: string): string {
      const element = document.createElement('div')
      element.innerText = input
      return element.innerHTML
    }

    const sanitizedText = sanitize(textComponent.text)

    // Check if the text element has been initialized
    if (!textElement.dataset.initialized) {
      if (isProximityPrompt) {
        textElement.innerHTML = `
          <div style="      
            background-color: rgba(200, 200, 200, 0.3); 
            color: #000; 
            padding: 0.4rem; 
            border-radius: 0.5rem; 
            box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2); 
            font-size: 1.5rem; 
            text-align: center;
            max-width: 300px;
            margin: auto;
          ">
            <div style="display: flex; align-items: center;">
              <div style="
                display: flex; 
                align-items: center; 
                justify-content: center; 
                width: 2.5rem; 
                height: 2.5rem; 
                background-color: rgba(0, 0, 0, 0.2); 
                border-radius: 0.375rem; 
                margin-right: 0.5rem;">
                <span style="font-size: 1.5rem; font-weight: bold; color: #FFFFFF;">E</span>
              </div>
              <div style="display: flex; flex-direction: column;">
                <p class="text-content" style="font-size: 0.875rem; font-weight: 800; line-height: 1.25rem; color: #FFFFFF;"></p>
                <p style="font-size: 0.75rem; color: #FFFFFF; text-align: right; margin-left: auto; font-style: italic;">Interact</p>
              </div>
            </div>
          </div>
        `
      } else {
        textElement.innerHTML = `
          <div style="display: flex; align-items: center; justify-content: space-between; background-color: rgba(23, 23, 23, 0.2); color: white; padding: 0.5rem; border-radius: 0.375rem; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); ">
            <p class="text-content" style="font-size: 0.875rem; font-weight: 500; line-height: 1.25rem;"></p>
          </div>`
      }
      textElement.dataset.initialized = 'true'
    }

    // Update only the text content
    const textContentElement = textElement.querySelector('.text-content')
    if (textContentElement) {
      textContentElement.textContent = sanitizedText
    }
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

      // If the entity is the current player, we don't want to show the text
      const currentPlayerComponent = entity.getComponent(CurrentPlayerComponent)
      if (currentPlayerComponent) {
        // Ignore the current player text
        continue
      }

      const positionComponent = entity.getComponent(PositionComponent)
      if (!positionComponent) continue
      const textObject = this.createTextObject(event.component, positionComponent)
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

      const positionComponent = entity.getComponent(PositionComponent)
      if (!positionComponent) continue
      const textObject = this.createTextObject(textComponent, positionComponent, true)
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

    const removedProximityPromptEvents: ComponentRemovedEvent<ProximityPromptComponent>[] =
      EventSystem.getEventsWrapped(ComponentRemovedEvent, ProximityPromptComponent)
    for (const event of removedProximityPromptEvents) {
      const textObject = this.textObjects.get(event.component.textComponent)
      if (textObject) {
        textObject.element.remove()
        textObject.removeFromParent() // Remove from mesh if attached
        this.textObjects.delete(event.component.textComponent)
      }
    }
  }

  private processEntities(entities: Entity[], currentPlayerEntity: Entity): void {
    const throttle = this.elapsedTime > this.updateInterval
    for (const entity of entities) {
      /**
       * An entity can at the same time have a TextComponent and a ProximityPromptComponent with a TextComponent
       */
      const textComponent = entity.getComponent(TextComponent)
      if (textComponent) {
        this.processTextComponent(entity, textComponent, currentPlayerEntity)
      }
      const proximityPromptComponent = entity.getComponent(ProximityPromptComponent)
      if (proximityPromptComponent) {
        this.processTextComponent(
          entity,
          proximityPromptComponent.textComponent,
          currentPlayerEntity,
          true
        )
      }
    }
    if (throttle) {
      this.elapsedTime = 0
    }
  }

  private processTextComponent(
    entity: Entity,
    textComponent: TextComponent,
    currentPlayerEntity: Entity,
    isProximityPrompt: boolean = false
  ): void {
    if (!textComponent) return

    const textObject = this.textObjects.get(textComponent)
    if (!textObject) return

    // If the TextComponent network component has been updated, update the text element content (Most likely the text)
    if (textComponent.updated) {
      this.updateTextElementContent(textObject.element, textComponent, isProximityPrompt)
    }

    // Throttle visibility check & text updates to two per second for performance
    if (this.elapsedTime < this.updateInterval) return

    // If the entity has no mesh, we will follow the position component
    if (!entity.getComponent(MeshComponent)) {
      const positionComponent = entity.getComponent(PositionComponent)
      if (positionComponent && positionComponent.updated) {
        this.updateTextObjectPosition(textObject, textComponent, positionComponent)
      }
    } else {
      // If the entity has a mesh, no need to follow the position component since it's attached to the mesh
      this.updateTextObjectPosition(textObject, textComponent)
    }

    this.updateVisibility(entity, currentPlayerEntity, textComponent)
  }

  // Updates text visibility based on two conditions:
  // 1. The text must be within displayDistance units of the player
  // 2. The text content must not be empty
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

    textObject.visible = distance <= textComponent.displayDistance && textComponent.text !== ''
  }

  private calculateDistance(pos1: PositionComponent, pos2: PositionComponent): number {
    return new THREE.Vector3(pos1.x, pos1.y, pos1.z).distanceTo(
      new THREE.Vector3(pos2.x, pos2.y, pos2.z)
    )
  }
}
