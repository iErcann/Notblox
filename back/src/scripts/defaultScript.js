function randomHexColor() {
  const hex = Math.floor(Math.random() * 16777215).toString(16)
  return '#' + '0'.repeat(6 - hex.length) + hex
}

// Load the game world
// Can also be hosted on a github repo : https://github.com/iErcann/Notblox-Assets + https://rawcdn.githack.com
new MapWorld('https://notbloxo.fra1.cdn.digitaloceanspaces.com/Notblox-Assets/world/FlatMap.glb')

// === Basic Entity Creation Examples ===

// Create a basic cube
const basicCubeParams = {
  position: { x: 0, y: 5, z: -10 },
  size: { width: 3, height: 3, depth: 3 },
}
new Cube(basicCubeParams)

// Create physics-enabled sphere with a white color
const basicSphereParams = {
  position: { x: 5, y: 10, z: -10 },
  radius: 6,
  color: '#ffffff',
}
new Sphere(basicSphereParams)

// === Interactive Trigger Zone Example ===
// Creates an invisible trigger zone that detects when players enter/exit
const triggerCube = new TriggerCube(
  -100,
  -5,
  -200, // position
  8,
  8,
  8, // size
  (entity) => {
    // onEnter callback
    if (entity.getComponent(PlayerComponent)) {
      console.log('Invisible trigger zone: Player entered the zone!')
      // You could add game logic here, like:
      // - Giving points
      // - Triggering events
      // - Spawning enemies
      entity
        .getComponent(DynamicRigidBodyComponent)
        .body.applyImpulse(new Rapier.Vector3(0, 9000, 0), true)
    }
  },
  (entity) => {
    // onExit callback
    if (entity.getComponent(PlayerComponent)) {
      console.log('Invisible trigger zone: Player left the zone!')
    }
  },
  true // Set to true to see the trigger zone (useful for debugging)
)
triggerCube.entity.addNetworkComponent(
  new TextComponent(triggerCube.entity.id, 'Trampoline', 0, 2, 0, 30)
)

// === Interactive Object Example ===
// Create a cube that reacts to player collision
for (let i = 0; i < 2; i++) {
  const interactiveCubeParams = {
    position: { x: 0, y: 5, z: -100 },
    size: { width: 2, height: 2, depth: 2 },
    physicsProperties: {
      enableCcd: true,
    },
  }
  const interactiveCube = new Cube(interactiveCubeParams)
  interactiveCube.entity.addComponent(
    new OnCollisionEnterEvent(interactiveCube.entity.id, (collidedWithEntity) => {
      // Only react to players
      if (collidedWithEntity.getComponent(PlayerComponent)) {
        // Change color of the cube on collision
        EventSystem.addEvent(new ColorEvent(interactiveCube.entity.id, randomHexColor()))

        // Apply upward force
        const rigidBody = interactiveCube.entity.getComponent(DynamicRigidBodyComponent)
        if (rigidBody) {
          rigidBody.body.applyImpulse(new Rapier.Vector3(0, 5000, 0), true)
        }
      }
    })
  )
}

// Zombie
const zombie = new Mesh({
  position: {
    x: -100,
    y: 10,
    z: 100,
  },
  meshUrl:
    'https://notbloxo.fra1.cdn.digitaloceanspaces.com/Notblox-Assets/character/MiniCharacter.glb',
  physicsProperties: {
    mass: 1,
    angularDamping: 0.5,
    enableCcd: true,
  },
  colliderProperties: {
    restitution: 0.7,
  },
})
zombie.entity.addNetworkComponent(new ColorComponent(zombie.entity.id, 'default'))
zombie.entity.addComponent(new ZombieComponent(zombie.entity.id))
zombie.entity.addNetworkComponent(new TextComponent(zombie.entity.id, '🤪 Zombie guy', 0, 2, 0))

// === Create Multiple Objects Example ===
// Creates a line of cubes with alternating colors
// const colors = ['#ff0000', '#00ff00', '#0000ff']
// for (let i = 0; i < 2; i++) {
//   const cubeParams = {
//     position: { x: i * 3, y: 5, z: -40 },
//     size: { width: 1, height: 1, depth: 1 },
//     color: colors[i % colors.length],
//   }
//   const cube = new Cube(cubeParams)
//   cube.entity.addComponent(new RandomizeComponent(cube.entity.id))
//   const sphereParams = {
//     position: { x: i * 3, y: 5, z: -40 },
//     radius: 1,
//     color: colors[i % colors.length],
//   }
//   const sphere = new Sphere(sphereParams)
//   sphere.entity.addComponent(new RandomizeComponent(sphere.entity.id))
// }

const cube = new Cube({
  position: {
    x: 100,
    y: 10,
    z: 100,
  },
  physicsProperties: {
    mass: 1,
    angularDamping: 0.5,
  },
})
const proximityPromptComponent = new ProximityPromptComponent(cube.entity.id, {
  text: 'Press E to change color',
  onInteract: (interactingEntity) => {
    cube.entity
      .getComponent(DynamicRigidBodyComponent)
      .body.applyImpulse(new Rapier.Vector3(0, 5, 0), true)

    const colorComponent = cube.entity.getComponent(ColorComponent)
    if (colorComponent) {
      // randomize color
      colorComponent.color = '#' + Math.floor(Math.random() * 16777215).toString(16)
      colorComponent.updated = true
    }
  },
  maxInteractDistance: 10,
  interactionCooldown: 200,
  holdDuration: 0,
})
cube.entity.addNetworkComponent(proximityPromptComponent)

for (let i = -3; i < 6; i++) {
  if (i === 0) continue
  const x = 5 * -i
  const y = 20
  const z = 20 * i
  const car = new Car({
    position: { x, y, z },
  })
  car.entity.addComponent(new SpawnPositionComponent(car.entity.id, x, y, z))
}

const car = new Car({
  position: { x: 0, y: 20, z: -500 },
  name: 'Weird Car',
  meshUrl: 'https://notbloxo.fra1.cdn.digitaloceanspaces.com/Notblox-Assets/vehicle/EzCar.glb',
})
car.entity.addComponent(new SpawnPositionComponent(car.entity.id, 150, 20, -500))

// Flying Car (different gravity scale, slow motion)
new Car({
  position: { x: 0, y: 20, z: -500 },
  physicsProperties: {
    gravityScale: 0.05,
    enableCcd: true,
  },
  name: 'Flying Car',
  color: '#78b5ff',
})

// Football test
function spawnFootballBall() {
  const ballSpawnPosition = { x: 0, y: 20, z: -10 }

  const sphereParams = {
    radius: 1.4,
    position: {
      x: ballSpawnPosition.x,
      y: ballSpawnPosition.y,
      z: ballSpawnPosition.z,
    },
    meshUrl: 'https://notbloxo.fra1.cdn.digitaloceanspaces.com/Notblox-Assets/base/Ball.glb',
    physicsProperties: {
      mass: 1,
      // Enable continuous collision detection to prevent the ball from going through the walls
      enableCcd: true,
      angularDamping: 0.5,
      linearDamping: 0.5,
    },
    colliderProperties: {
      friction: 0.4,
      restitution: 0.8,
    },
  }

  let ball
  // Initialize the ball using SphereParams
  ball = new Sphere(sphereParams)
  ball.entity.addComponent(
    new SpawnPositionComponent(
      ball.entity.id,
      ballSpawnPosition.x,
      ballSpawnPosition.y,
      ballSpawnPosition.z
    )
  )

  const proximityPromptComponent = new ProximityPromptComponent(ball.entity.id, {
    text: 'Kick',
    onInteract: (playerEntity) => {
      const ballRigidbody = ball.entity.getComponent(DynamicRigidBodyComponent)
      const playerRotationComponent = playerEntity.getComponent(RotationComponent)

      if (ballRigidbody && playerRotationComponent && playerEntity.getComponent(InputComponent)) {
        // Convert rotation to direction vector
        const direction = playerRotationComponent.getForwardDirection()
        // Calculate player looking direction
        // sendChatMessage('⚽', `Player shot the ball !`)
        const playerLookingDirectionVector = new Rapier.Vector3(
          direction.x * 1500,
          0,
          direction.z * 1500
        )

        ballRigidbody.body.applyImpulse(playerLookingDirectionVector, true)
      }
    },
    maxInteractDistance: 10,
    interactionCooldown: 2000,
    holdDuration: 0,
  })
  ball.entity.addNetworkComponent(proximityPromptComponent)
}

spawnFootballBall()

spawnFootballBall()
