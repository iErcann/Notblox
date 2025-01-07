function randomHexColor() {
  const hex = Math.floor(Math.random() * 16777215).toString(16)
  return '#' + '0'.repeat(6 - hex.length) + hex
}

// Load the game world
// Can also be hosted on a gittblox-Assets + https://rawcdn.githack.comhub repo : https://github.com/iErcann/No
new MapWorld('http://localhost:4001/FlatMap.glb')

new Car({
  position: {
    x: 10,
    y: 10,
    z: 10,
  },
})

new Car({
  position: {
    x: 50,
    y: 10,
    z: 10,
  },
  meshUrl: 'http://localhost:4001/EzCar.glb',
})

for (let i = 0; i < 4; i++) {
  const cube = new Cube({
    position: {
      x: 10 * i,
      y: 10 * i,
      z: 0,
    },
    physicsProperties: {
      mass: 1,
      angularDamping: 0.5,
      enableCcd: true,
    },
  })
  const proximityPromptComponent = new ProximityPromptComponent(cube.entity.id, {
    text: 'Change color',
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
}

const sphereParams = {
  radius: 1.4,
  position: {
    x: 40,
    y: 10,
    z: 10,
  },
  meshUrl:
    'https://rawcdn.githack.com/iErcann/Notblox-Assets/f8b474a703930afb1caa82fd2bda4ca336a00a29/Ball.glb',
  physicsProperties: {
    mass: 1,
    // Enable continuous collision detection to prevent the ball from going through the walls
    enableCcd: true,
    angularDamping: 0.5,
  },
}

let ball
// Initialize the ball using SphereParams
ball = new Sphere(sphereParams)

// That's why the proximity prompt component is added to the network data component to be synced with the front
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
        direction.x * 500,
        0,
        direction.z * 500
      )

      ballRigidbody.body.applyImpulse(playerLookingDirectionVector, true)
    }
  },
  maxInteractDistance: 10,
  interactionCooldown: 2000,
  holdDuration: 0,
})
ball.entity.addNetworkComponent(proximityPromptComponent)

// const proximityPromptComponent = new ProximityPromptComponent(car.entity.id, {
//   text: 'Kick',
//   onInteract: (playerEntity) => {
//     const ballRigidbody = car.entity.getComponent(DynamicRigidBodyComponent)
//     const playerRotationComponent = playerEntity.getComponent(RotationComponent)

//     if (ballRigidbody && playerRotationComponent && playerEntity.getComponent(InputComponent)) {
//       // Convert rotation to direction vector
//       const direction = playerRotationComponent.getForwardDirection()
//       // Calculate player looking direction
//       const playerLookingDirectionVector = new Rapier.Vector3(
//         direction.x * 52500,
//         0,
//         direction.z * 52500
//       )

//       ballRigidbody.body.applyImpulse(playerLookingDirectionVector, true)
//     }
//   },
//   maxInteractDistance: 15,
//   interactionCooldown: 2000,
//   holdDuration: 0,
// })
// const networkDataComponent = car.entity.getComponent(NetworkDataComponent)
// networkDataComponent.addComponent(proximityPromptComponent)
// car.entity.addComponent(proximityPromptComponent)

// for (let i = 1; i < 5; i++) {
//   new Cube({
//     position: {
//       x: 10 + i * 10,
//       y: 10 + i * 10,
//       z: 0,
//     },
//     size: {
//       width: i / 2,
//       height: i / 2,
//       depth: i / 2,
//     },
//     physicsProperties: {
//       mass: 0.1,
//       angularDamping: 0,
//       linearDamping: 0,
//       enableCcd: true,
//     },
//   })
// }

// setInterval(() => {
//   console.log(car.entity.getComponent(TextComponent))
//   car.entity.getComponent(TextComponent).text = 'Hello' + Math.random()
//   car.entity.getComponent(TextComponent).updated = true
// }, 1000)

// // ---------
// for (let i = 0; i < 100; i++) {
//   const cube = new Cube({
//     position: {
//       x: i * 20,
//       y: i * 20,
//       z: 100,
//     },
//     physicsProperties: {
//       mass: 1,
//       angularDamping: 0.5,
//       enableCcd: true,
//     },
//   })
//   const proximityPromptComponent = new ProximityPromptComponent(cube.entity.id, {
//     text: 'Press E to change color',
//     onInteract: (interactingEntity) => {
//       cube.entity
//         .getComponent(DynamicRigidBodyComponent)
//         .body.applyImpulse(new Rapier.Vector3(0, 5, 0), true)

//       const colorComponent = cube.entity.getComponent(ColorComponent)
//       if (colorComponent) {
//         // randomize color
//         colorComponent.color = '#' + Math.floor(Math.random() * 16777215).toString(16)
//         colorComponent.updated = true
//       }
//     },
//     maxInteractDistance: 10,
//     interactionCooldown: 200,
//     holdDuration: 0,
//   })
//   cube.entity.addComponent(proximityPromptComponent)
//   const networkDataComponent = cube.entity.getComponent(NetworkDataComponent)
//   networkDataComponent.addComponent(proximityPromptComponent)

//   setTimeout(() => {
//     EventSystem.addNetworkEvent(new EntityDestroyedEvent(cube.entity.id))
//   }, i * 1000)
// }
