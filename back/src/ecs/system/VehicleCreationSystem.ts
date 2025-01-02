import { EventSystem } from '../../../../shared/system/EventSystem.js'
import { ComponentAddedEvent } from '../../../../shared/component/events/ComponentAddedEvent.js'
import { Entity } from '../../../../shared/entity/Entity.js'
import { VehicleComponent } from '../../../../shared/component/VehicleComponent.js'
import { EntityManager } from '../../../../shared/system/EntityManager.js'
import { DynamicRigidBodyComponent } from '../component/physics/DynamicRigidBodyComponent.js'
import Rapier from '../../physics/rapier.js'
import { VehicleRayCastComponent } from '../component/physics/VehicleRayCastComponent.js'

export class VehicleCreationSystem {
  update(entities: Entity[], world: Rapier.World): void {
    const createEvents = EventSystem.getEventsWrapped(ComponentAddedEvent, VehicleComponent)
    for (const event of createEvents) {
      const entity = EntityManager.getEntityById(entities, event.entityId)

      if (!entity) {
        console.error('VehicleCreationSystem: Entity not found')
        continue
      }
      const rigidbody = entity.getComponent(DynamicRigidBodyComponent)?.body
      if (!rigidbody) {
        console.error('VehicleCreationSystem: No rigidbody found')
        continue
      }
      const vehicle = world.createVehicleController(rigidbody!)

      // Define wheel positions and directions
      const wheelConfigs = [
        { position: new Rapier.Vector3(-4.65, -1, -2.85) }, // FRONT
        { position: new Rapier.Vector3(-4.65, -1, 2.85) }, // BACK
        { position: new Rapier.Vector3(4.65, -1, -2.85) }, // FRONT
        { position: new Rapier.Vector3(4.65, -1, 2.85) }, // BACK
      ]

      for (const config of wheelConfigs) {
        vehicle.addWheel(
          config.position,
          new Rapier.Vector3(0, -1, 0),
          new Rapier.Vector3(-1, 0, 0),
          1,
          1
        )
      }

      for (let i = 0; i < 4; i++) {
        vehicle.setWheelSuspensionCompression(i, 0.82)
        vehicle.setWheelSuspensionRelaxation(i, 0.88)
        vehicle.setWheelSuspensionStiffness(i, 5.8)
        vehicle.setWheelMaxSuspensionForce(i, 6000)
        vehicle.setWheelMaxSuspensionTravel(i, 5)
        vehicle.setWheelSideFrictionStiffness(i, 0.5)
      }

      entity.addComponent(new VehicleRayCastComponent(entity.id, vehicle))
    }
  }
}
