import { EntityManager } from '../../../../shared/entity/EntityManager.js'
import { Entity } from '../../../../shared/entity/Entity.js'
import { SerializedEntityType } from '../../../../shared/network/server/serialized.js'
import { TrimeshEvent } from '../component/events/TrimeshEvent.js'
import { NetworkDataComponent } from '../../../../shared/component/NetworkDataComponent.js'

export class MapWorld {
  entity: Entity
  constructor() {
    this.entity = EntityManager.getInstance().createEntity(SerializedEntityType.WORLD)

    // TODO: Use the new logic for the events.
    this.entity.addComponent(
      new TrimeshEvent(this.entity.id, '../front/public/assets/keneeyworldled.glb')
    )
    const networkDataComponent = new NetworkDataComponent(this.entity.id, this.entity.type, [])
  }
}
