import Rapier from '../../../physics/rapier.js'
import { ComponentAddedEvent } from '../../../../../shared/component/events/ComponentAddedEvent.js'
import { Entity } from '../../../../../shared/entity/Entity.js'
import { BaseEventSystem } from '../../../../../shared/entity/EventSystem.js'
import { KinematicRigidBodyComponent } from '../../component/physics/KinematicRigidBodyComponent.js'
import { TrimeshCollidersComponent } from '../../component/physics/TrimeshColliderComponent.js'

export class KinematicPhysicsBodySystem {
  update(world: Rapier.World) {
    const createEvents = BaseEventSystem.getEventsWrapped(
      ComponentAddedEvent,
      KinematicRigidBodyComponent
    )

    for (let event of createEvents) {
      this.onComponentAdded(event, world)
    }
  }
  onComponentAdded(event: ComponentAddedEvent<KinematicRigidBodyComponent>, world: Rapier.World) {
    // No position component here, we move the body directly, so it's at the origin
    const physicsBodyComponent = event.component
    const kinematic = Rapier.RigidBodyDesc.kinematicPositionBased()

    physicsBodyComponent.body = world.createRigidBody(kinematic)
  }
}
