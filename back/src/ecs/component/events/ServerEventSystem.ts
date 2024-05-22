import { Entity } from 'shared/entity/Entity.js'
import { BaseEventSystem } from '../../../../../shared/entity/EventSystem.js'

export class ServerEventSystem extends BaseEventSystem {
  constructor() {
    super(ServerEventSystem)
  }
  update(entities: Entity[]): void {}
  afterUpdate(entities: Entity[]): void {}
  initializeSubscriptions(): void {}
}
