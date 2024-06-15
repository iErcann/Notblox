import { Script, createContext } from 'node:vm'
import { RandomizeComponent } from './ecs/component/RandomizeComponent.js'
import { Cube } from './ecs/entity/Cube.js'
import { Sphere } from './ecs/entity/Sphere.js'
import { MapWorld } from './ecs/entity/MapWorld.js'
import { startGameLoop } from './index.js'
import { resolve } from 'path'
import { readFile } from 'fs/promises'
import { ZombieComponent } from './ecs/component/ZombieComponent.js'

async function loadGameLogic() {
  const gameScript = process.env.GAME_SCRIPT || 'defaultScript.js' // Default script name if not provided
  const codePath = resolve(process.cwd(), 'src/scripts', gameScript)
  if (!process.env.GAME_SCRIPT) console.log('No GAME_SCRIPT provided, using default script')
  console.log(`Loading game logic from ${codePath}`)
  const code = await readFile(codePath, 'utf8')

  const sandbox = { setTimeout, Cube, RandomizeComponent, Sphere, MapWorld, ZombieComponent }
  const context = createContext(sandbox)
  const script = new Script(code)
  script.runInContext(context)
}

loadGameLogic()
  .then(() => startGameLoop())
  .catch((err) => console.error(err))
