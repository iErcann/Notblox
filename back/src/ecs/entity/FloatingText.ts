import { PositionComponent } from '../../../../shared/component/PositionComponent.js'
import { Entity } from '../../../../shared/entity/Entity.js'
import { SerializedEntityType } from '../../../../shared/network/server/serialized.js'
import { EntityManager } from '../../../../shared/system/EntityManager.js'
import { TextComponent } from '../../../../shared/component/TextComponent.js'
import { NetworkDataComponent } from '../../../../shared/network/NetworkDataComponent.js'

export class FloatingText {
  entity: Entity
  textComponent: TextComponent
  constructor(text: string, x: number, y: number, z: number, displayDistance: number = 1000) {
    this.entity = EntityManager.createEntity(SerializedEntityType.FLOATING_TEXT)

    const positionComponent = new PositionComponent(this.entity.id, x, y, z)
    this.entity.addComponent(positionComponent)

    this.textComponent = new TextComponent(this.entity.id, text, 0, 0, 0, displayDistance)
    this.entity.addComponent(this.textComponent)

    // Network data component
    const networkDataComponent = new NetworkDataComponent(this.entity.id, this.entity.type, [
      positionComponent,
      this.textComponent,
    ])
    this.entity.addComponent(networkDataComponent)
  }

  updateText(text: string) {
    this.textComponent.text = text
    this.textComponent.updated = true
  }
}
