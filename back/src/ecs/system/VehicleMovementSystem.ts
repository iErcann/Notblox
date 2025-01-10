import { Entity } from '../../../../shared/entity/Entity.js'
import { VehicleComponent } from '../../../../shared/component/VehicleComponent.js'
import { EntityManager } from '../../../../shared/system/EntityManager.js'
import { InputComponent } from '../component/InputComponent.js'
import { DynamicRigidBodyComponent } from '../component/physics/DynamicRigidBodyComponent.js'
import { VehicleRayCastComponent } from '../component/physics/VehicleRayCastComponent.js'
import { VehicleOccupancyComponent } from '../../../../shared/component/VehicleOccupancyComponent.js'
import { PositionComponent } from '../../../../shared/component/PositionComponent.js'
import Rapier from '../../physics/rapier.js'

export class VehicleMovementSystem {
  // Hack for proximity prompt
  snapAllOccupantsToVehicle(entities: Entity[]): void {
    for (const carEntity of entities) {
      const carComponent = carEntity.getComponent(VehicleComponent)
      const carPosition = carEntity.getComponent(PositionComponent)
      if (carComponent && carPosition) {
        if (carComponent.driverEntityId) {
          const driver = EntityManager.getEntityById(entities, carComponent.driverEntityId)
          if (driver) {
            const rigidBody = driver.getComponent(DynamicRigidBodyComponent)?.body
            if (rigidBody) {
              rigidBody.setTranslation(
                new Rapier.Vector3(carPosition.x, carPosition.y, carPosition.z),
                true
              )
            }
          }
        }
        const passengers = carComponent.passengerEntityIds
        for (const passengerId of passengers) {
          const passenger = EntityManager.getEntityById(entities, passengerId)
          if (passenger) {
            const rigidBody = passenger.getComponent(DynamicRigidBodyComponent)?.body
            if (rigidBody) {
              rigidBody.setTranslation(
                new Rapier.Vector3(carPosition.x, carPosition.y, carPosition.z),
                true
              )
            }
          }
        }
      }
    }
  }

  update(entities: Entity[], dt: number): void {
    this.snapAllOccupantsToVehicle(entities)
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

        const driverInputComponent = driver.getComponent(InputComponent)

        if (!driver.getComponent(VehicleOccupancyComponent)) {
          console.error(
            'VehicleInputSystem: Driver is not in a vehicle ? The driver should have a VehicleOccupancyComponent : ' +
              driver
          )
          continue
        }

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

          // Engine force for back wheels
          const engineForce = driverInputComponent.up
            ? 15000
            : driverInputComponent.down
            ? -15000
            : 0
          vehicleController.setWheelEngineForce(0, engineForce)
          vehicleController.setWheelEngineForce(2, engineForce)

          // Steering for front wheels
          const steeringAngle = driverInputComponent.left
            ? Math.PI / 24
            : driverInputComponent.right
            ? -Math.PI / 24
            : 0
          vehicleController.setWheelSteering(1, steeringAngle)
          vehicleController.setWheelSteering(3, steeringAngle)

          // const vehiclePosition = rigidBody.translation()
          // Update the wheels for visual purpose
          // for (let i = 0; i < carComponent.wheels.length; i++) {
          //   const wheel = carComponent.wheels[i]
          //   const wheelAxleCs = vehicleController.wheelAxleCs(i)!
          //   const connection = vehicleController.wheelChassisConnectionPointCs(i)?.y || 0
          //   const suspension = vehicleController.wheelSuspensionLength(i) || 0
          //   const steering = vehicleController.wheelSteering(i) || 0
          //   const rotationRad = vehicleController.wheelRotation(i) || 0

          //   // Also do the rotation of the wheel
          //   // Y is up, X is right, Z is forward
          //   // ADD THE ROTATION OF THE CAR
          //   wheel.positionComponent.y =
          //     VehicleMovementSystem.WHEEL_POSITIONS[i][1] +
          //     vehiclePosition.y +
          //     connection -
          //     suspension +
          //     suspension * Math.cos(steering) +
          //     suspension * Math.sin(steering)
          //   wheel.positionComponent.x =
          //     VehicleMovementSystem.WHEEL_POSITIONS[i][0] +
          //     vehiclePosition.x +
          //     suspension * Math.sin(steering) -
          //     suspension * Math.cos(steering)
          //   wheel.positionComponent.z =
          //     VehicleMovementSystem.WHEEL_POSITIONS[i][2] + vehiclePosition.z + suspension

          //   // Update the wheel rotation
          //   wheel.rotationComponent.x = rotationRad
          //   wheel.rotationComponent.y = steering
          //   wheel.rotationComponent.z = wheelAxleCs.x
          //   wheel.rotationComponent.w = wheelAxleCs.y
          // }

          // Update the vehicle controller
          carComponent.updated = true
          vehicleController.updateVehicle(dt / 1000)
        }
      }
    }
  }
}
