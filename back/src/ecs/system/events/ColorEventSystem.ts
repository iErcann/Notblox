import { EntityManager } from '../../../../../shared/system/EntityManager.js'
import { ColorComponent } from '../../../../../shared/component/ColorComponent.js'
import { Entity } from '../../../../../shared/entity/Entity.js'
import { ColorEvent } from '../../component/events/ColorEvent.js'
import { EventSystem } from '../../../../../shared/system/EventSystem.js'

export class ColorEventSystem {
  update(entities: Entity[]) {
    const eventColors = EventSystem.getEvents(ColorEvent)

    for (const eventColor of eventColors) {
      const entity = EntityManager.getEntityById(entities, eventColor.entityId)
      if (!entity) return

      const colorComponent = entity.getComponent(ColorComponent)
      if (!colorComponent) return

      if (colorComponent && eventColor) {
        colorComponent.color = eventColor.color
        colorComponent.updated = true
      }
    }
  }
}
