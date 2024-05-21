import { InputComponent } from '../component/InputComponent.js'
import { PhysicsBodyComponent } from '../component/PhysicsBodyComponent.js'
import { Entity } from '../../../../shared/entity/Entity.js'
import Rapier from '../../physics/rapier.js'
import { PositionComponent } from '../../../../shared/component/PositionComponent.js'
import { PhysicsColliderComponent } from '../component/PhysicsColliderComponent.js'
import { SingleSizeComponent } from '../../../../shared/component/SingleSizeComponent.js'
import { GroundCheckComponent } from '../component/GroundedComponent.js'
import { ZombieComponent } from '../component/ZombieComponent.js'
import { PlayerComponent } from '../component/tag/TagPlayerComponent.js'
import { Vector3 } from 'three'
import { ColorComponent } from '../../../../shared/component/ColorComponent.js'
import { EventSystem } from './events/EventSystem.js'
import { EventColor } from '../component/events/EventColor.js'
import { RandomizeComponent } from '../component/RandomizeComponent.js'
import { EntityManager } from '../../../../shared/entity/EntityManager.js'

export class ZombieSystem {
  private followDistance = 30

  update(dt: number, entities: Entity[], world: Rapier.World): void {
    const players = EntityManager.getEntitiesWithComponent(entities, PlayerComponent)

    for (const entity of entities) {
      if (entity.getComponent(ZombieComponent)) {
        this.processZombieEntity(entity, players, dt)
      }
    }
  }

  private processZombieEntity(entity: Entity, players: Entity[], dt: number): void {
    const rigidBodyComponent = entity.getComponent(PhysicsBodyComponent)
    const positionComponent = entity.getComponent(PositionComponent)
    const colorComponent = entity.getComponent(ColorComponent)

    if (!rigidBodyComponent || !positionComponent || !colorComponent) {
      return // Skip processing this entity if any required component is missing
    }

    const nearbyPlayers = this.findNearbyPlayers(players, positionComponent)
    if (nearbyPlayers.length === 0) {
      this.handleDistantProximity(entity, colorComponent)
      return
    }

    for (const player of nearbyPlayers) {
      const direction = this.calculateDirection(player, positionComponent)
      this.handleCloseProximity(entity, direction, rigidBodyComponent, colorComponent, dt)
    }
  }

  private findNearbyPlayers(players: Entity[], positionComponent: PositionComponent): Entity[] {
    const nearbyPlayers: Entity[] = []

    for (const player of players) {
      const playerPosition = player.getComponent(PositionComponent)
      if (!playerPosition) continue

      const dx = playerPosition.x - positionComponent.x
      const dy = playerPosition.y - positionComponent.y
      const dz = playerPosition.z - positionComponent.z
      const distance = Math.sqrt(dx * dx + dy * dy + dz * dz)
      if (distance < this.followDistance) {
        nearbyPlayers.push(player)
      }
    }

    return nearbyPlayers
  }

  private calculateDirection(target: Entity, sourcePosition: PositionComponent): Vector3 {
    const targetPosition = target.getComponent(PositionComponent)
    if (!targetPosition) return new Vector3(0, 0, 0)

    const direction = new Vector3(
      targetPosition.x - sourcePosition.x,
      targetPosition.y - sourcePosition.y,
      targetPosition.z - sourcePosition.z
    )
    direction.normalize()

    return direction
  }

  private handleCloseProximity(
    entity: Entity,
    direction: Vector3,
    rigidBodyComponent: PhysicsBodyComponent,
    colorComponent: ColorComponent,
    dt: number
  ): void {
    direction.multiplyScalar(1.5 * dt)
    const impulse = new Rapier.Vector3(direction.x, direction.y, direction.z)
    rigidBodyComponent.body.applyImpulse(impulse, true)

    // Dirty state
    if (colorComponent.color !== '#ff0000') {
      this.setZombieToRed(entity)
    }
  }

  private handleDistantProximity(entity: Entity, colorComponent: ColorComponent): void {
    // Dirty state
    if (colorComponent.color !== '#00ff00') {
      this.setZombieToGreen(entity)
    }
  }

  private setZombieToRed(entity: Entity): void {
    entity.removeComponent(RandomizeComponent)
    const eventSystem = EventSystem.getInstance()
    eventSystem.addEvent(new EventColor(entity.id, '#ff0000'))
  }

  private setZombieToGreen(entity: Entity): void {
    entity.addComponent(new RandomizeComponent(entity.id))
    const eventSystem = EventSystem.getInstance()
    eventSystem.addEvent(new EventColor(entity.id, '#00ff00'))
  }
}
