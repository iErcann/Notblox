import { EntityManager } from '../../../../../shared/entity/EntityManager.js'
import { ColorComponent } from '../../../../../shared/component/ColorComponent.js'
import { Entity } from '../../../../../shared/entity/Entity.js'
import { EventColor } from '../../component/events/EventColor.js'

export class SyncColorSystem {
  update(entities: Entity[], eventColor: EventColor) {
    const entity = EntityManager.getEntityById(entities, eventColor.entityId)
    if (!entity) return

    const colorComponent = entity.getComponent(ColorComponent)
    if (!colorComponent) return

    if (colorComponent && eventColor) {
      colorComponent.color = eventColor.color
      console.log('SyncColorSystem: colorComponent.color', colorComponent.color)
      colorComponent.updated = true
    }
  }
}

// export class SyncColorSystem {
//   onStart(entities: Entity[], color: ColorComponent) {
//     ...
//   }
//   onDestroy(entities: Entity[], color: ColorComponent) {
//     ...
//   }
//   onChange(entities: Entity[], color: ColorComponent) {
//     ...
//   }
//   update(entities: Entity[], color: ColorComponent) {
//     const entity = EntityManager.getEntityById(entities, color.entityId)
//     if (!entity) return

//     const colorComponent = entity.getComponent(ColorComponent)
//     if (!colorComponent) return

//     if (colorComponent && color) {
//       colorComponent.color = color.color
//       colorComponent.updated = true
//     }
//   }
// }
