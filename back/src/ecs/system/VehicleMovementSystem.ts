import { Entity } from '../../../../shared/entity/Entity.js'
import { VehicleComponent } from '../../../../shared/component/VehicleComponent.js'
import { EntityManager } from '../../../../shared/system/EntityManager.js'
import { InputComponent } from '../component/InputComponent.js'
import { DynamicRigidBodyComponent } from '../component/physics/DynamicRigidBodyComponent.js'
import { VehicleRayCastComponent } from '../component/physics/VehicleRayCastComponent.js'
import { VehicleOccupancyComponent } from '../../../../shared/component/VehicleOccupancyComponent.js'

export class VehicleMovementSystem {
  update(entities: Entity[], dt: number): void {
    for (const entity of entities) {
      const carComponent = entity.getComponent(VehicleComponent)
      if (carComponent) {
        if (!carComponent.driverEntityId) {
          continue
        }
        const driver = EntityManager.getEntityById(entities, carComponent.driverEntityId)
        if (!driver) {
          console.error(
            'VehicleInputSystem: Driver entity not found for the id ' + carComponent.driverEntityId
          )
          continue
        }

        if (!driver.getComponent(VehicleOccupancyComponent)) {
          console.error(
            'VehicleInputSystem: Driver is not in a vehicle ? The driver should have a VehicleOccupancyComponent : ' +
              driver
          )
          continue
        }
        const driverInputComponent = driver.getComponent(InputComponent)
        if (!driverInputComponent) {
          console.error('VehicleInputSystem: Driver has no input component')
          continue
        }

        const rigidBody = entity.getComponent(DynamicRigidBodyComponent)?.body
        const vehicleController = entity.getComponent(VehicleRayCastComponent)?.raycastController

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
            ? Math.PI / 16
            : driverInputComponent.right
            ? -Math.PI / 16
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
