function randomHexColor() {
  const hex = Math.floor(Math.random() * 16777215).toString(16)
  return '#' + '0'.repeat(6 - hex.length) + hex
}

// Load the game world
// Can also be hosted on a github repo : https://github.com/iErcann/Notblox-Assets + https://rawcdn.githack.com
new MapWorld('https://myaudio.nyc3.cdn.digitaloceanspaces.com/aqsworld.glb')

// === Basic Entity Creation Examples ===

// Create a basic cube
new Cube(0, 5, -10, 3, 3, 3)

// Create physics-enabled sphere with a white color
new Sphere(5, 10, -10, 4, '#ffffff')

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
for (let i = 0; i < 3; i++) {
  const interactiveCube = new Cube(0, 5, -100, 2, 2, 2)
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
  const cube = new Cube(i * 3, 5, -40, 1, 1, 1, colors[i % colors.length])
  cube.entity.addComponent(new RandomizeComponent(cube.entity.id))
  const sphere = new Sphere(i * 3, 5, -40, 1, colors[i % colors.length])
  sphere.entity.addComponent(new RandomizeComponent(sphere.entity.id))
}
