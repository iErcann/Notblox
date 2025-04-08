import 'dotenv/config'
import { readFile } from 'fs/promises'
import { resolve } from 'path'
import { ColorComponent } from '../../shared/component/ColorComponent.js'
import { PositionComponent } from '../../shared/component/PositionComponent.js'
import { RotationComponent } from '../../shared/component/RotationComponent.js'
import { EntityManager } from '../../shared/system/EntityManager.js'
import { EventSystem } from '../../shared/system/EventSystem.js'
import { InputComponent } from './ecs/component/InputComponent.js'
import { ProximityPromptComponent } from '../../shared/component/ProximityPromptComponent.js'
import { LockedRotationComponent } from './ecs/component/LockedRotationComponent.js'
import { RandomizeComponent } from './ecs/component/RandomizeComponent.js'
import { SpawnPositionComponent } from './ecs/component/SpawnPositionComponent.js'
import { ZombieComponent } from './ecs/component/ZombieComponent.js'
import { MessageEvent } from './ecs/component/events/MessageEvent.js'
import { OnCollisionEnterEvent } from './ecs/component/events/OnCollisionEnterEvent.js'
import { OnCollisionExitEvent } from './ecs/component/events/OnCollisionExitEvent.js'
import { BoxColliderComponent } from './ecs/component/physics/BoxColliderComponent.js'
import { CapsuleColliderComponent } from './ecs/component/physics/CapsuleColliderComponent.js'
import { DynamicRigidBodyComponent } from './ecs/component/physics/DynamicRigidBodyComponent.js'
import { KinematicRigidBodyComponent } from './ecs/component/physics/KinematicRigidBodyComponent.js'
import { PhysicsPropertiesComponent } from './ecs/component/physics/PhysicsPropertiesComponent.js'
import { SphereColliderComponent } from './ecs/component/physics/SphereColliderComponent.js'
import { TrimeshColliderComponent } from './ecs/component/physics/TrimeshColliderComponent.js'
import { PlayerComponent } from '../../shared/component/PlayerComponent.js'
import { Cube } from './ecs/entity/Cube.js'
import { MapWorld } from './ecs/entity/MapWorld.js'
import { Sphere } from './ecs/entity/Sphere.js'
import { startGameLoop } from './index.js'
import { ColorEvent } from './ecs/component/events/ColorEvent.js'
import { SizeEvent } from './ecs/component/events/SizeEvent.js'
import { SingleSizeEvent } from './ecs/component/events/SingleSizeEvent.js'
import Rapier from './physics/rapier.js'
import { Player } from './ecs/entity/Player.js'
import { TriggerCube } from './ecs/entity/TriggerCube.js'
import { NetworkDataComponent } from '../../shared/network/NetworkDataComponent.js'
import { FloatingText } from './ecs/entity/FloatingText.js'
import { ScriptableSystem } from './ecs/system/ScriptableSystem.js'
import { TextComponent } from '../../shared/component/TextComponent.js'
import { Car } from './ecs/entity/Car.js'
import { EntityDestroyedEvent } from '../../shared/component/events/EntityDestroyedEvent.js'
import { Mesh } from './ecs/entity/Mesh.js'
import { ComponentRemovedEvent } from '../../shared/component/events/ComponentRemovedEvent.js'
import { ComponentAddedEvent } from '../../shared/component/events/ComponentAddedEvent.js'
import { InvisibleComponent } from '../../shared/component/InvisibleComponent.js'
import { ChatComponent } from './ecs/component/tag/TagChatComponent.js'
import { SerializedMessageType } from '../../shared/network/server/serialized.js'
import { OrbitalCompanion } from './ecs/entity/OrbitalCompanion.js'
import { FollowTargetComponent } from './ecs/component/FollowTargetComponent.js'
import { SizeComponent } from '../../shared/component/SizeComponent.js'
import { SingleSizeComponent } from '../../shared/component/SingleSizeComponent.js'

async function loadGameLogic() {
  const gameScript = process.env.GAME_SCRIPT || 'defaultScript.js' // Default script name if not provided
  const codePath = resolve(process.cwd(), 'src/scripts', gameScript)
  if (!process.env.GAME_SCRIPT) console.log('No GAME_SCRIPT provided, using default script')
  console.log(`Loading game logic from ${codePath}`)
  const code = await readFile(codePath, 'utf8')

  const sandbox = {
    // Core Systems
    EntityManager,
    EventSystem,
    setTimeout,
    setInterval,
    console,
    Rapier,
    ScriptableSystem,

    // Base Components
    PositionComponent,
    RotationComponent,
    ColorComponent,
    InputComponent,
    SpawnPositionComponent,
    LockedRotationComponent,
    RandomizeComponent,
    ZombieComponent,
    ProximityPromptComponent,
    NetworkDataComponent,
    TextComponent,
    InvisibleComponent,
    SerializedMessageType,
    FollowTargetComponent,
    SingleSizeComponent,
    SizeComponent,

    // Physics Components
    BoxColliderComponent,
    CapsuleColliderComponent,
    SphereColliderComponent,
    TrimeshColliderComponent,
    DynamicRigidBodyComponent,
    KinematicRigidBodyComponent,
    PhysicsPropertiesComponent,

    // Tag Components
    PlayerComponent,
    ChatComponent,

    // Events
    OnCollisionEnterEvent,
    OnCollisionExitEvent,
    MessageEvent,
    ColorEvent,
    SizeEvent,
    SingleSizeEvent,
    EntityDestroyedEvent,
    ComponentRemovedEvent,
    ComponentAddedEvent,

    // Entities
    Cube,
    Sphere,
    MapWorld,
    Mesh,
    Player,
    TriggerCube,
    FloatingText,
    Car,
    OrbitalCompanion,
  }
  // Execute the script
  const script = new Function(...Object.keys(sandbox), code)
  script(...Object.values(sandbox))
}

loadGameLogic()
  .then(() => startGameLoop())
  .catch((err) => console.error(err))
