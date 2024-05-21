import { SerializedComponent, SerializedComponentType } from '../network/server/serialized.js'
import { NetworkComponent } from '../network/NetworkComponent.js'

export class NameCompoennt extends NetworkComponent {
  constructor(entityId: number, public name: string) {
    super(entityId, SerializedComponentType.NAME) // Call the parent constructor with the entityId
  }
}
