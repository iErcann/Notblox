import { Entity } from '@shared/entity/Entity'
import * as THREE from 'three'

import { WheelComponent } from '@shared/component/WheelComponent'
import { MeshComponent } from '../component/MeshComponent'
import { VehicleComponent } from '@shared/component/VehicleComponent'
import { ComponentAddedEvent } from '@shared/component/events/ComponentAddedEvent'
import { EntityManager } from '@shared/system/EntityManager'
import { EventSystem } from '@shared/system/EventSystem'
import { Game } from '@/game/game'

export class VehicleSystem {
  private entityWheels: Map<number, THREE.Mesh[]> = new Map()

  update(entities: Entity[]) {
    // Catch vehicle creation, add wheels to it.
    const addedVehicleEvents = EventSystem.getEventsWrapped(ComponentAddedEvent, VehicleComponent)
    for (const addedEvent of addedVehicleEvents) {
      console.log('VehicleSystem: Vehicle created')
      const vehicleEntity = EntityManager.getEntityById(entities, addedEvent.entityId)
      if (!vehicleEntity) continue
      const vehicleComponent: VehicleComponent = addedEvent.component
      const meshComponent = vehicleEntity.getComponent(MeshComponent)
      const wheelComponents: WheelComponent[] = vehicleComponent.wheels
      if (vehicleComponent && meshComponent) {
        const wheelMeshes: THREE.Mesh[] = []
        for (const wheel of wheelComponents) {
          const wheelMesh = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 32))
          wheelMesh.position.set(
            wheel.positionComponent.x,
            wheel.positionComponent.y,
            wheel.positionComponent.z
          )
          Game.getInstance().renderer.scene.add(wheelMesh)
          //   meshComponent.mesh.add(wheelMesh)
          wheelMeshes.push(wheelMesh)
        }
        this.entityWheels.set(vehicleEntity.id, wheelMeshes)
      }
    }

    for (const entity of entities) {
      const vehicleComponent = entity.getComponent(VehicleComponent)
      const meshComponent = entity.getComponent(MeshComponent)
      if (vehicleComponent && meshComponent) {
        const wheelMeshes = this.entityWheels.get(entity.id)
        if (wheelMeshes) {
          for (let i = 0; i < vehicleComponent.wheels.length; i++) {
            const wheel = vehicleComponent.wheels[i]
            const wheelMesh = wheelMeshes[i]
            // Position Component is world position, so we need to convert it to local position
            // const localPosition = meshComponent.mesh.worldToLocal(
            //   new THREE.Vector3(
            //     wheel.positionComponent.x,
            //     wheel.positionComponent.y,
            //     wheel.positionComponent.z
            //   )
            // )
            console.log('VehicleSystem: Updating wheel', wheel.positionComponent)
            wheelMesh.position.set(
              wheel.positionComponent.x,
              wheel.positionComponent.y,
              wheel.positionComponent.z
            )
            // wheelMesh.rotation.set(
            //   wheel.rotationComponent.x,
            //   wheel.rotationComponent.y,
            //   wheel.rotationComponent.z
            // )
          }
        }
      }
    }
  }
}
