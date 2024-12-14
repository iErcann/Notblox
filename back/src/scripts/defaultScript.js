// Runtime script

// Create map world from a .glb file
const mapWorld = new MapWorld('https://myaudio.nyc3.cdn.digitaloceanspaces.com/aqsworld.glb')

function sendChatMessage(entityId, authorStr, messageStr) {
  EventSystem.addEvent(new ChatMessageEvent(entityId, authorStr, messageStr))
}

// Function to create a cube with a RandomizeComponent
function createRandomCube(x, y, z, width, height, depth) {
  const cube = new Cube(x, y, z, width, height, depth)
  cube.entity.addComponent(new RandomizeComponent(cube.entity.id))

  return cube
}

// Function to create a sphere with a RandomizeComponent
function createRandomSphere(x, y, z, radius) {
  const sphere = new Sphere(x, y, z, radius)
  sphere.entity.addComponent(new RandomizeComponent(sphere.entity.id))
  return sphere
}

// Create a random cube
new Cube(0, 50, -100, 1, 1, 1)
new Cube(0, 50, -400, 3, 3, 3)

for (let i = 0; i < 2; i++) {
  const cubeWithCollision = new Cube(0, 50, -120, 2, 2, 2)
  cubeWithCollision.entity.addComponent(
    new OnCollisionEnterEvent(cubeWithCollision.entity.id, (collidedWithEntity) => {
      // If the other entity is a player
      const tagPlayerComponent = collidedWithEntity.getComponent(PlayerComponent)
      if (tagPlayerComponent) {
        // If the cube collided with a player, move the cube up
        const positionComponent = cubeWithCollision.entity.getComponent(PositionComponent)
        const cubeRigidBodyComponent =
          cubeWithCollision.entity.getComponent(DynamicRigidBodyComponent)
        if (positionComponent && cubeRigidBodyComponent) {
          // Random hex color
          const randomHex = Math.floor(Math.random() * 16777215).toString(16)
          EventSystem.addEvent(new ColorEvent(cubeWithCollision.entity.id, '#' + randomHex))

          // Impulse up 10 units
          cubeRigidBodyComponent.body.applyImpulse(new Rapier.Vector3(0, 5000, 0), true)
        }
      }
    })
  )
}
// cubeWithCollision.entity.addComponent(
//   new OnCollisionExitEvent(cubeWithCollision.entity.id, (collidedWithEntity) => {})
// )

// // Create a series of cubes
// for (let i = 1; i < 5; i++) {
//   new Cube(0, 5, 5 * i, 1, 1, 1)
// }

// Create a sphere
new Sphere(0, 30, 0, 3)

// Create a series of random spheres
for (let i = 1; i < 5; i++) {
  createRandomSphere(0, i * 30, 0, 3)
}

// Create another sphere
new Sphere(10, 30, 0, 4)
