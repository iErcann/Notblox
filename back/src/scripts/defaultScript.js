function randomHexColor() {
  const hex = Math.floor(Math.random() * 16777215).toString(16)
  return '#' + '0'.repeat(6 - hex.length) + hex
}

// Load the game world
// Can also be hosted on a github repo : https://github.com/iErcann/Notblox-Assets + https://rawcdn.githack.com
new MapWorld('https://myaudio.nyc3.cdn.digitaloceanspaces.com/aqsworld.glb')

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
  radius: 4,
  color: '#ffffff',
}
new Sphere(basicSphereParams)

// === Interactive Trigger Zone Example ===
// Creates an invisible trigger zone that detects when players enter/exit
new TriggerCube(
  -180,
  0,
  -250, // position
  6,
  4,
  6, // size
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

// === Interactive Object Example ===
// Create a cube that reacts to player collision
for (let i = 0; i < 2; i++) {
  const interactiveCubeParams = {
    position: { x: 0, y: 5, z: -100 },
    size: { width: 2, height: 2, depth: 2 },
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

// === Create Multiple Objects Example ===
// Creates a line of cubes with alternating colors
const colors = ['#ff0000', '#00ff00', '#0000ff']
for (let i = 0; i < 2; i++) {
  const cubeParams = {
    position: { x: i * 3, y: 5, z: -40 },
    size: { width: 1, height: 1, depth: 1 },
    color: colors[i % colors.length],
  }
  const cube = new Cube(cubeParams)
  cube.entity.addComponent(new RandomizeComponent(cube.entity.id))
  const sphereParams = {
    position: { x: i * 3, y: 5, z: -40 },
    radius: 1,
    color: colors[i % colors.length],
  }
  const sphere = new Sphere(sphereParams)
  sphere.entity.addComponent(new RandomizeComponent(sphere.entity.id))
}

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
cube.entity.addComponent(proximityPromptComponent)
const networkDataComponent = cube.entity.getComponent(NetworkDataComponent)
networkDataComponent.addComponent(proximityPromptComponent)
