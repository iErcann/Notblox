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
import Rapier from '../../physics/rapier.js'

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

    this.entity.addComponent(
      new ColliderPropertiesComponent(this.entity.id, {
        friction: 0.0,
        restitution: 0.0,
      })
    )
    this.entity.addComponent(
      new ConvexHullColliderComponent(this.entity.id, meshUrl ?? 'http://localhost:4001/Car.glb')
    )
    this.entity.addComponent(
      new PhysicsPropertiesComponent(
        this.entity.id,
        physicsProperties ?? {
          enableCcd: true,
          angularDamping: 0.05,
          linearDamping: 0.05,
          mass: 5,
        }
      )
    )

    const proximityPromptComponent = new ProximityPromptComponent(this.entity.id, {
      text: 'Enter/Exit',
      onInteract: (playerEntity) => {
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
              // Update the player entity with a new vehicle occupancy component
              const vehicleOccupancyComponent = new VehicleOccupancyComponent(
                playerEntity.id,
                this.entity.id
              )
              playerEntity.addNetworkComponent(vehicleOccupancyComponent)

              // Hack : Disable player rigid body
              const rigidBody = playerEntity.getComponent(DynamicRigidBodyComponent)?.body
              if (rigidBody) {
                rigidBody.setEnabled(false)
              }
            }
            // If there's already a driver, the player becomes a passenger
            else {
              const vehicleOccupancyComponent = new VehicleOccupancyComponent(
                playerEntity.id,
                this.entity.id
              )
              playerEntity.addNetworkComponent(vehicleOccupancyComponent)

              // Hack : Disable player rigid body
              const rigidBody = playerEntity.getComponent(DynamicRigidBodyComponent)?.body
              if (rigidBody) {
                rigidBody.setEnabled(false)
              }
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
              // Remove the vehicle occupancy component from the player
              // This also removes the VehicleOccupancyComponent from the NetworkDataComponent
              // This will throw a OnComponentRemoved<VehicleOccupancyComponent> event
              // Catch both by the front & back.
              // The back will clean up the vehicle component
              // The front will stop visually following the vehicle client-side (No more FollowComponent)
              playerEntity.removeComponent(VehicleOccupancyComponent)

              // Hack : Enable player rigid body
              const rigidBody = playerEntity.getComponent(DynamicRigidBodyComponent)?.body
              if (rigidBody) {
                rigidBody.setEnabled(true)
                // Set the player beside the car
                const position = this.entity.getComponent(PositionComponent)
                if (position) {
                  rigidBody.setTranslation(
                    new Rapier.Vector3(position.x + 4, position.y, position.z),
                    true
                  )
                }
              }
            }
          }
        }
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
}
