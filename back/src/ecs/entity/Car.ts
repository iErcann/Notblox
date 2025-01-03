import { PositionComponent } from '../../../../shared/component/PositionComponent.js'
import { RotationComponent } from '../../../../shared/component/RotationComponent.js'
import { Entity } from '../../../../shared/entity/Entity.js'
import { SerializedEntityType } from '../../../../shared/network/server/serialized.js'
import { SizeComponent } from '../../../../shared/component/SizeComponent.js'
import { EntityManager } from '../../../../shared/system/EntityManager.js'
import { NetworkDataComponent } from '../../../../shared/network/NetworkDataComponent.js'
import { DynamicRigidBodyComponent } from '../component/physics/DynamicRigidBodyComponent.js'
import { ServerMeshComponent } from '../../../../shared/component/ServerMeshComponent.js'
import {
  PhysicsPropertiesComponent,
  PhysicsPropertiesComponentData,
} from '../component/physics/PhysicsPropertiesComponent.js'
import { TextComponent } from '../../../../shared/component/TextComponent.js'
import { ConvexHullColliderComponent } from '../component/physics/ConvexHullColliderComponent.js'
import { VehicleComponent } from '../../../../shared/component/VehicleComponent.js'
import { VehicleOccupancyComponent } from '../../../../shared/component/VehicleOccupancyComponent.js'

import { ColliderPropertiesComponent } from '../component/physics/ColliderPropertiesComponent.js'
import { ProximityPromptComponent } from '../../../../shared/component/ProximityPromptComponent.js'
import { PlayerComponent } from '../../../../shared/component/PlayerComponent.js'

export interface CarParams {
  position: {
    x: number
    y: number
    z: number
  }
  /**
   * @default 2
   */
  size?: {
    width: number
    height: number
    depth: number
  }
  /**
   * @default "red"
   */
  color?: string
  /**
   * @default https://example.com/car.glb
   */
  meshUrl?: string
  /**
   * @default {}
   */
  physicsProperties?: PhysicsPropertiesComponentData
}

export class Car {
  entity: Entity

  constructor(params: CarParams) {
    const { position, size, color, meshUrl, physicsProperties } = params

    this.entity = EntityManager.createEntity(SerializedEntityType.VEHICLE)
    const vehicleComponent = new VehicleComponent(this.entity.id)
    this.entity.addComponent(vehicleComponent)

    const positionComponent = new PositionComponent(
      this.entity.id,
      position.x,
      position.y,
      position.z
    )
    this.entity.addComponent(positionComponent)

    const rotationComponent = new RotationComponent(this.entity.id, 0, 0, 0, 0)
    this.entity.addComponent(rotationComponent)

    const serverMeshComponent = new ServerMeshComponent(
      this.entity.id,
      meshUrl ?? 'http://localhost:4001/Car.glb'
    )
    this.entity.addComponent(serverMeshComponent)

    const textComponent = new TextComponent(this.entity.id, 'Car prototype', 0, 5, 0, 30)
    this.entity.addComponent(textComponent)

    const sizeComponent = new SizeComponent(
      this.entity.id,
      size?.width ?? 1,
      size?.height ?? 1,
      size?.depth ?? 1
    )
    this.entity.addComponent(sizeComponent)

    this.entity.addComponent(new ColliderPropertiesComponent(this.entity.id, false, 0.0, 0.0))
    this.entity.addComponent(
      new ConvexHullColliderComponent(this.entity.id, meshUrl ?? 'http://localhost:4001/Car.glb')
    )
    this.entity.addComponent(
      new PhysicsPropertiesComponent(
        this.entity.id,
        physicsProperties ?? {
          enableCcd: true,
          mass: 1,
          angularDamping: 0.001,
          linearDamping: 0.0005,
        }
      )
    )

    const proximityPromptComponent = new ProximityPromptComponent(this.entity.id, {
      text: 'Enter/Exit',
      onInteract: (playerEntity) => {
        console.log('Car interacted', this)
        // Ensure a player is interacting with the car
        const playerComponent = playerEntity.getComponent(PlayerComponent)
        const playerVehicleOccupancyComponent = playerEntity.getComponent(VehicleOccupancyComponent)
        const vehicleComponent = this.entity.getComponent(VehicleComponent)

        if (playerComponent && vehicleComponent) {
          // Is there a driver on the car?
          const vehicleHasDriver = vehicleComponent.driverEntityId !== undefined
          // Is the current player already occupying a vehicle?
          const playerInsideVehicle = playerVehicleOccupancyComponent !== undefined

          // If the player is not already inside a vehicle
          if (!playerInsideVehicle) {
            // If there's no driver, the player becomes the driver
            if (!vehicleHasDriver) {
              // Player becomes the driver
              vehicleComponent.driverEntityId = playerEntity.id
              vehicleComponent.updated = true

              // Update the player entity with a new vehicle occupancy component
              const vehicleOccupancyComponent = new VehicleOccupancyComponent(
                playerEntity.id,
                this.entity.id
              )
              playerEntity.addNetworkComponent(vehicleOccupancyComponent)
              console.log('Player became the driver', playerEntity)
            }
            // If there's already a driver, the player becomes a passenger
            else {
              vehicleComponent.passengerEntityIds.push(playerEntity.id)
              const vehicleOccupancyComponent = new VehicleOccupancyComponent(
                playerEntity.id,
                this.entity.id
              )
              playerEntity.addNetworkComponent(vehicleOccupancyComponent)
              console.log('Player became a passenger')
            }
          }
          // Player is already inside a vehicle
          else {
            // Is he inside the car he's interacting with?
            const insideCar =
              vehicleComponent?.driverEntityId === playerEntity.id ||
              vehicleComponent?.passengerEntityIds.includes(playerEntity.id)

            // if so, he's exiting the car
            if (insideCar) {
              const isDriver = vehicleComponent.driverEntityId === playerEntity.id
              // Is he exiting as a driver?
              if (isDriver) {
                vehicleComponent.driverEntityId = undefined
                console.log('Driver left the car')
              } else {
                vehicleComponent.passengerEntityIds = vehicleComponent.passengerEntityIds.filter(
                  (passengerId) => passengerId !== playerEntity.id
                )
                console.log('Passenger left the car')
              }
              // Update the vehicle component to reflect the changes
              vehicleComponent.updated = true
              // Remove the vehicle occupancy component from the player
              // This also removes the VehicleOccupancyComponent from the NetworkDataComponent
              // This will throw a OnComponentRemoved<VehicleOccupancyComponent> event
              // Player will stop visually following the vehicle client-side (No more FollowComponent)
              playerEntity.removeComponent(VehicleOccupancyComponent)
            }
          }
        }
        this.updateText()
      },
      maxInteractDistance: 15,
      interactionCooldown: 1000,
      holdDuration: 0,
    })
    this.entity.addComponent(proximityPromptComponent)

    this.entity.addComponent(new DynamicRigidBodyComponent(this.entity.id))

    const networkDataComponent = new NetworkDataComponent(this.entity.id, this.entity.type, [
      positionComponent,
      rotationComponent,
      sizeComponent,
      serverMeshComponent,
      textComponent,
      proximityPromptComponent,
      vehicleComponent,
    ])
    this.entity.addComponent(networkDataComponent)
  }

  updateText() {
    // Debug text a bit above the car
    // Just to show driver / passenger count

    const textComponent = this.entity.getComponent(TextComponent)
    if (textComponent) {
      const vehicleComponent = this.entity.getComponent(VehicleComponent)
      if (vehicleComponent) {
        textComponent.text = `🚗 Driver: ${
          vehicleComponent.driverEntityId ? 'Yes' : 'No'
        } | 🧑‍🤝‍🧑 Passengers: ${vehicleComponent.passengerEntityIds.length}`
        textComponent.updated = true
      }
    }
  }
}
