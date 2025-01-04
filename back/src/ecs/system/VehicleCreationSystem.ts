import { EventSystem } from '../../../../shared/system/EventSystem.js'
import { ComponentAddedEvent } from '../../../../shared/component/events/ComponentAddedEvent.js'
import { Entity } from '../../../../shared/entity/Entity.js'
import { VehicleComponent } from '../../../../shared/component/VehicleComponent.js'
import { EntityManager } from '../../../../shared/system/EntityManager.js'
import { DynamicRigidBodyComponent } from '../component/physics/DynamicRigidBodyComponent.js'
import Rapier from '../../physics/rapier.js'
import { VehicleRayCastComponent } from '../component/physics/VehicleRayCastComponent.js'
import { ComponentRemovedEvent } from '../../../../shared/component/events/ComponentRemovedEvent.js'
import { VehicleOccupancyComponent } from '../../../../shared/component/VehicleOccupancyComponent.js'
import { TextComponent } from '../../../../shared/component/TextComponent.js'

export class VehicleCreationSystem {
  private static readonly WHEEL_POSITIONS = [
    [-4.65, -1, -2.85], // FRONT
    [-4.65, -1, 2.85], // BACK
    [4.65, -1, -2.85], // FRONT
    [4.65, -1, 2.85], // BACK
  ]

  update(entities: Entity[], world: Rapier.World): void {
    this.handleVehicleCreation(entities, world)
    this.handlePlayerExitVehicle(entities)
    this.handlePlayerEnterVehicle(entities)
  }

  private handleVehicleCreation(entities: Entity[], world: Rapier.World): void {
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

      const vehicle = world.createVehicleController(rigidbody)

      // Add wheels and configure suspension
      VehicleCreationSystem.WHEEL_POSITIONS.forEach(([x, y, z]) => {
        vehicle.addWheel(
          new Rapier.Vector3(x, y, z),
          new Rapier.Vector3(0, -1, 0),
          new Rapier.Vector3(-1, 0, 0),
          1,
          1
        )
      })

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

  // When a player disconnects, it will throw a ComponentRemovedEvent<VehicleOccupancyComponent> event
  // Update the related VehicleComponent to reflect this change
  // This is also catched by the destruction system on player disconnection
  private handlePlayerExitVehicle(entities: Entity[]) {
    const exitedEvents = EventSystem.getEventsWrapped(
      ComponentRemovedEvent,
      VehicleOccupancyComponent
    )
    for (const exitEvent of exitedEvents) {
      const component: VehicleOccupancyComponent = exitEvent.component
      const exitingEntityId = component.entityId
      const vehicleEntity = EntityManager.getEntityById(entities, component.vehicleEntityId)

      if (vehicleEntity) {
        const vehicleComponent = vehicleEntity.getComponent(VehicleComponent)
        if (vehicleComponent) {
          // If the exiting entity is the driver, remove the driver
          console.log('COMPARING', vehicleComponent.driverEntityId, exitingEntityId)
          if (vehicleComponent.driverEntityId === exitingEntityId) {
            console.log('Removing driver', exitingEntityId)
            vehicleComponent.driverEntityId = undefined
          }
          // If the exiting entity is a passenger, remove it from the passengers
          else {
            console.log('Removing passenger', exitingEntityId)
            vehicleComponent.passengerEntityIds = vehicleComponent.passengerEntityIds.filter(
              (id) => id !== exitingEntityId
            )
          }
          // Update the vehicle component to reflect the changes
          vehicleComponent.updated = true

          // Update the text component to reflect the changes
          const textComponent = vehicleEntity.getComponent(TextComponent)
          if (textComponent) {
            this.updateText(textComponent, vehicleComponent)
          }
        }
      }
    }
  }

  // When a player gets a VehicleOccupancyComponent, it means he just entered a vehicle
  // Update the related VehicleComponent to reflect this change
  private handlePlayerEnterVehicle(entities: Entity[]) {
    const addEvents = EventSystem.getEventsWrapped(ComponentAddedEvent, VehicleOccupancyComponent)
    for (const addEvent of addEvents) {
      const component: VehicleOccupancyComponent = addEvent.component
      const entity = EntityManager.getEntityById(entities, component.entityId)
      const vehicleEntity = EntityManager.getEntityById(entities, component.vehicleEntityId)

      if (entity && vehicleEntity) {
        const vehicleComponent = vehicleEntity.getComponent(VehicleComponent)
        if (vehicleComponent) {
          if (vehicleComponent.driverEntityId === undefined) {
            // If there's no driver, the player becomes the driver
            vehicleComponent.driverEntityId = entity.id
            console.log('Player became the driver', entity.id)
            console.log(vehicleComponent)
          } else {
            // If there's already a driver, the player becomes a passenger
            vehicleComponent.passengerEntityIds.push(entity.id)
            console.log('Player became a passenger', entity.id)
          }
          // Update the vehicle component to reflect the changes
          vehicleComponent.updated = true

          // Update the text component to reflect the changes
          const textComponent = vehicleEntity.getComponent(TextComponent)
          if (textComponent) {
            this.updateText(textComponent, vehicleComponent)
          }
        }
      }
    }
  }
  private updateText(textComponent: TextComponent, vehicleComponent: VehicleComponent) {
    textComponent.text = `🚗 Driver: ${
      vehicleComponent.driverEntityId ? 'Yes' : 'No'
    } | 🧑‍🤝‍🧑 Passengers: ${vehicleComponent.passengerEntityIds.length}`
    textComponent.updated = true
  }
}
