import { Component } from '../component/Component.js'
import { SerializedComponentType } from './server/serialized.js'

/**
 * `NetworkComponent` is an abstract class for components that need network synchronization.
 * It extends the base `Component` class.
 *
 * It has an `updated` property which, when true, indicates the component needs to be sent over the network.
 * The `SleepCheckSystem` resets this property to false at the end of each ECS loop.
 *
 * Always set `updated` to true when the component changes to ensure it is synchronized.
 *
 */
export abstract class NetworkComponent extends Component {
  updated: boolean = true
  constructor(
    entityId: number,
    public type: SerializedComponentType = SerializedComponentType.NONE
  ) {
    super(entityId)
  }

  abstract serialize(): any
  abstract deserialize(data: any): void
}
