import Rapier from '../../../physics/rapier.js'
import { ComponentAddedEvent } from '../../../../../shared/component/events/ComponentAddedEvent.js'
import { EventSystem } from '../../../../../shared/system/EventSystem.js'
import { KinematicRigidBodyComponent } from '../../component/physics/KinematicRigidBodyComponent.js'
import { ComponentRemovedEvent } from '../../../../../shared/component/events/ComponentRemovedEvent.js'

export class KinematicRigidBodySystem {
  update(world: Rapier.World) {
    const createEvents = EventSystem.getEventsWrapped(
      ComponentAddedEvent,
      KinematicRigidBodyComponent
    )

    for (const event of createEvents) {
      this.onComponentAdded(event, world)
    }

    const removedEvents = EventSystem.getEventsWrapped(
      ComponentRemovedEvent,
      KinematicRigidBodyComponent
    )

    for (const event of removedEvents) {
      this.onComonentRemoved(event, world)
    }
  }
  onComponentAdded(event: ComponentAddedEvent<KinematicRigidBodyComponent>, world: Rapier.World) {
    // No position component here, we move the body directly, so it's at the origin
    const physicsBodyComponent = event.component
    const kinematic = Rapier.RigidBodyDesc.kinematicPositionBased()
    physicsBodyComponent.body = world.createRigidBody(kinematic)
  }

  onComonentRemoved(
    event: ComponentRemovedEvent<KinematicRigidBodyComponent>,
    world: Rapier.World
  ) {
    const physicsBodyComponent = event.component
    if (physicsBodyComponent.body) world.removeRigidBody(physicsBodyComponent.body)
  }
}
