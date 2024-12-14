import { Script, createContext } from 'node:vm'
import { RandomizeComponent } from './ecs/component/RandomizeComponent.js'
import { Cube } from './ecs/entity/Cube.js'
import { Sphere } from './ecs/entity/Sphere.js'
import { MapWorld } from './ecs/entity/MapWorld.js'
import { startGameLoop } from './index.js'
import { resolve } from 'path'
import { readFile } from 'fs/promises'
import { ZombieComponent } from './ecs/component/ZombieComponent.js'
import { SpawnPositionComponent } from './ecs/component/SpawnPositionComponent.js'
import { RotationComponent } from '../../shared/component/RotationComponent.js'
import { ColorComponent } from '../../shared/component/ColorComponent.js'
import { InputComponent } from './ecs/component/InputComponent.js'
import { OnCollisionEnterComponent } from './ecs/component/OnCollisionEnterComponent.js'
import { OnCollisionExitComponent } from './ecs/component/OnCollisionExitComponent.js'
import { PlayerComponent } from './ecs/component/tag/TagPlayerComponent.js'
import { ChatComponent } from './ecs/component/tag/TagChatComponent.js'
import { BoxColliderComponent } from './ecs/component/physics/BoxColliderComponent.js'
import { CapsuleColliderComponent } from './ecs/component/physics/CapsuleColliderComponent.js'
import { DynamicRigidBodyComponent } from './ecs/component/physics/DynamicRigidBodyComponent.js'
import { PhysicsPropertiesComponent } from './ecs/component/physics/PhysicsPropertiesComponent.js'
import { SphereColliderComponent } from './ecs/component/physics/SphereColliderComponent.js'
import { TrimeshColliderComponent } from './ecs/component/physics/TrimeshColliderComponent.js'
import { LockedRotationComponent } from './ecs/component/LockedRotationComponent.js'
import { PositionComponent } from '../../shared/component/PositionComponent.js'
import { KinematicRigidBodyComponent } from './ecs/component/physics/KinematicRigidBodyComponent.js'

async function loadGameLogic() {
  const gameScript = process.env.GAME_SCRIPT || 'defaultScript.js' // Default script name if not provided
  const codePath = resolve(process.cwd(), 'src/scripts', gameScript)
  if (!process.env.GAME_SCRIPT) console.log('No GAME_SCRIPT provided, using default script')
  console.log(`Loading game logic from ${codePath}`)
  const code = await readFile(codePath, 'utf8')

  const sandbox = {
    setTimeout,
    Cube,
    RandomizeComponent,
    Sphere,
    MapWorld,
    ZombieComponent,
    SpawnPositionComponent,
    RotationComponent,
    ColorComponent,
    PositionComponent,
    LockedRotationComponent,
    InputComponent,
    OnCollisionEnterComponent,
    OnCollisionExitComponent,
    PlayerComponent,
    ChatComponent,
    BoxColliderComponent,
    CapsuleColliderComponent,
    DynamicRigidBodyComponent,
    KinematicRigidBodyComponent,
    PhysicsPropertiesComponent,
    SphereColliderComponent,
    TrimeshColliderComponent,
  }
  const context = createContext(sandbox)
  const script = new Script(code)
  script.runInContext(context)
}

loadGameLogic()
  .then(() => startGameLoop())
  .catch((err) => console.error(err))
