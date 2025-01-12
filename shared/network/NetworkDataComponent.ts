import { NetworkComponent } from './NetworkComponent.js'
import {
  SerializedComponentType,
  SerializedEntity,
  SerializedEntityType,
} from './server/serialized.js'
import { Component } from '../component/Component.js'

export class NetworkDataComponent extends Component {
  type = SerializedComponentType.NONE

  constructor(
    entityId: number,
    public entityType: SerializedEntityType,
    public components: NetworkComponent[]
  ) {
    super(entityId)
  }

  getComponents(): NetworkComponent[] {
    return this.components
  }

  removeComponent(componentType: typeof NetworkComponent) {
    this.components = this.components.filter((c) => !(c instanceof componentType))
  }

  addComponent(component: NetworkComponent) {
    this.components.push(component)
  }

  removeAllComponents() {
    this.components = []
  }

  serialize(serializeAll = false): SerializedEntity | null {
    const components = this.getComponents()
    const serializedComponents = components
      .filter((component) => serializeAll || component.updated === true)
      .map((component: NetworkComponent) => {
        return { t: component.type, ...component.serialize() }
      })

    if (serializedComponents.length === 0) {
      return null
    }

    const broadcastMessage = {
      id: this.entityId,
      t: this.entityType,
      c: serializedComponents,
    }

    return broadcastMessage
  }
}
