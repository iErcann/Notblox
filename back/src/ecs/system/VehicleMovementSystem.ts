import { EventSystem } from '../../../../shared/system/EventSystem.js'
import { ComponentAddedEvent } from '../../../../shared/component/events/ComponentAddedEvent.js'
import { Entity } from '../../../../shared/entity/Entity.js'
import { VehicleComponent } from '../../../../shared/component/VehicleComponent.js'
import { EntityManager } from '../../../../shared/system/EntityManager.js'
import { InputComponent } from '../component/InputComponent.js'
import { DynamicRigidBodyComponent } from '../component/physics/DynamicRigidBodyComponent.js'
import Rapier from '../../physics/rapier.js'
import { DynamicRayCastVehicleController } from '@dimforge/rapier3d-compat'

export class VehicleMovementSystem {
  // Map each Entity with a VehicleComponent to a DynamicRayCastVehicleController
  private vehicleControllers = new Map<Entity, DynamicRayCastVehicleController>()
  update(entities: Entity[], world: Rapier.World, dt: number): void {
    const createEvents = EventSystem.getEventsWrapped(ComponentAddedEvent, VehicleComponent)
    for (const event of createEvents) {
      const entity = EntityManager.getEntityById(entities, event.entityId)

      if (!entity) {
        console.error('ConvexHullColliderSystem: Entity not found')
        continue
      }
      const rigidbody = entity.getComponent(DynamicRigidBodyComponent)?.body
      if (!rigidbody) {
        console.error('CarMovementSystem: No rigidbody found')
        continue
      }
      const vehicle = world.createVehicleController(rigidbody!)

      // Define wheel positions and directions
      const wheelConfigs = [
        { position: new Rapier.Vector3(-4.65, 0, -2.85) }, // FRONT
        { position: new Rapier.Vector3(-4.65, 0, 2.85) }, // BACK
        { position: new Rapier.Vector3(4.65, 0, -2.85) }, // FRONT
        { position: new Rapier.Vector3(4.65, 0, 2.85) }, // BACK
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

      this.vehicleControllers.set(entity, vehicle)
    }

    for (const entity of entities) {
      const carComponent = entity.getComponent(VehicleComponent)
      if (carComponent) {
        if (!carComponent.driverEntityId) {
          console.error('CarMovementSystem: No driver set')
          continue
        }
        const driver = EntityManager.getEntityById(entities, carComponent.driverEntityId)
        if (!driver) {
          console.error(
            'CarMovementSystem: Driver entity not found for the id ' + carComponent.driverEntityId
          )
          continue
        }
        const driverInputComponent = driver.getComponent(InputComponent)
        if (!driverInputComponent) {
          console.error('CarMovementSystem: Driver has no input component')
          continue
        }

        const rigidBody = entity.getComponent(DynamicRigidBodyComponent)?.body
        const vehicleController = this.vehicleControllers.get(entity)

        if (rigidBody && vehicleController) {
          // Wake up rigid body only when applying force/torque
          if (
            driverInputComponent.up ||
            driverInputComponent.down ||
            driverInputComponent.left ||
            driverInputComponent.right
          ) {
            rigidBody.wakeUp()
          }

          // Engine force for back wheels (2 and 3)
          const engineForce = driverInputComponent.up
            ? 15000
            : driverInputComponent.down
            ? -15000
            : 0
          vehicleController.setWheelEngineForce(0, engineForce)
          vehicleController.setWheelEngineForce(2, engineForce)

          // Steering for front wheels (0 and 2)
          const steeringAngle = driverInputComponent.left
            ? 0.5
            : driverInputComponent.right
            ? -0.5
            : 0
          vehicleController.setWheelSteering(1, steeringAngle)
          vehicleController.setWheelSteering(3, steeringAngle)

          // Update the vehicle controller
          vehicleController.updateVehicle(dt / 1000)
        }
      }
    }
  }
}
