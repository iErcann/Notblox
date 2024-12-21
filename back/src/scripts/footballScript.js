new MapWorld('http://localhost:4001/Stadium.glb')

// Create the ball
const ballSpawnPosition = {
  x: 0,
  y: -15,
  z: -355,
}
const ball = new Sphere(
  ballSpawnPosition.x,
  ballSpawnPosition.y,
  ballSpawnPosition.z,
  1.4,
  'default',
  'https://rawcdn.githack.com/iErcann/Notblox-Assets/707558dda5772f387508259e5a3e0741e15b2b57/Ball.glb'
)
ball.entity.addComponent(
  new SpawnPositionComponent(
    ball.entity.id,
    ballSpawnPosition.x,
    ballSpawnPosition.y,
    ballSpawnPosition.z
  )
)

// When the player is near the ball, he can shoot it
// For that, we need to add a key interactible component to the ball
// The front also needs to render a key icon above the ball
// That's why the key interactible component is added to the network data component to be synced with the front
const keyInteractibleComponent = new KeyInteractibleComponent(
  ball.entity.id,
  (interactingEntity) => {
    // TODO : Shoot the ball
    console.log('INTERACTED !', interactingEntity)
  }
)

// Create a floating text with the score  (emoji and score)
const scoreText = new FloatingText('🔴 0 - 0 🔵', 0, 0, -450)

const networkDataComponent = ball.entity.getComponent(NetworkDataComponent)
networkDataComponent.addComponent(keyInteractibleComponent)
ball.entity.addComponent(keyInteractibleComponent)

// TODO : Make the ball interactive
// ball.entity.addComponent(
//   new OnCollisionEnterEvent(ball.entity.id, (playerEntity) => {
//     // Check if the collided entity is a player
//     if (playerEntity.getComponent(PlayerComponent) && playerEntity.getComponent(InputComponent)) {
//       // Calculate impulse direction and magnitude
//       const ballBody = ball.entity.getComponent(DynamicRigidBodyComponent).body

//       //   Apply player looking direction to the ball
//       const playerLookingDirection = playerEntity.getComponent(InputComponent).lookingYAngle
//       const playerLookingDirectionVector = new Rapier.Vector3(
//         -Math.cos(playerLookingDirection) * 500,
//         0,
//         -Math.sin(playerLookingDirection) * 500
//       )
//       console.log(playerLookingDirectionVector, 'playerLookingDirectionVector')
//       // Apply impulse to the ball
//       ballBody.applyImpulse(playerLookingDirectionVector, true)
//     }
//   })
// )

// Find the chat entity
const allEntities = EntityManager.getInstance().getAllEntities()
const chatEntity = EntityManager.getFirstEntityWithComponent(allEntities, ChatComponent)

// Initialize scores
let redScore = 0
let blueScore = 0

function sendChatMessage(author, message) {
  EventSystem.addEvent(new ChatMessageEvent(chatEntity.id, author, message))
}

function updateScore() {
  sendChatMessage('⚽', `Score: 🔴 Red ${redScore} - ${blueScore} Blue 🔵`)
  scoreText.updateText(`🔴 ${redScore} - ${blueScore} 🔵`)
}

sendChatMessage('⚽', 'Welcome to the football game!')
updateScore()

// Create teleport triggers

// Red team teleport
new TriggerCube(
  -24,
  -4,
  -29,
  10,
  2,
  10,
  (collidedWithEntity) => {
    if (collidedWithEntity.getComponent(PlayerComponent)) {
      // Apply color to the player
      EventSystem.addEvent(new ColorEvent(collidedWithEntity.id, '#f0513c'))
      // Teleport the player to the red team's spawn position
      collidedWithEntity
        .getComponent(DynamicRigidBodyComponent)
        .body.setTranslation(new Rapier.Vector3(-80, 5, -350), true)
    }
  },
  () => {},
  false
)

// Blue team teleport
new TriggerCube(
  24,
  -4,
  -29,
  10,
  2,
  10,
  (collidedWithEntity) => {
    if (collidedWithEntity.getComponent(PlayerComponent)) {
      // Apply color to the player
      EventSystem.addEvent(new ColorEvent(collidedWithEntity.id, '#3c9cf0'))
      // Teleport the player to the blue team's spawn position
      collidedWithEntity
        .getComponent(DynamicRigidBodyComponent)
        .body.setTranslation(new Rapier.Vector3(80, 5, -350), true)
    }
  },
  () => {},
  false
)

// Create trigger goals
// Red team goals
new TriggerCube(
  -120,
  -40,
  -350,
  5,
  10,
  13,
  (collidedWithEntity) => {
    // Only react to the ball
    if (collidedWithEntity.id === ball.entity.id) {
      blueScore++ // Blue team scores when ball enters red team's goal
      sendChatMessage('⚽', '🔵 Blue team scores! 🎉')
      updateScore()

      // Reset ball position after goal
      const body = ball.entity.getComponent(DynamicRigidBodyComponent).body
      body.setTranslation(
        new Rapier.Vector3(ballSpawnPosition.x, ballSpawnPosition.y, ballSpawnPosition.z),
        new Rapier.Quaternion(0, 0, 0, 1)
      )
      body.setLinvel(new Rapier.Vector3(0, 0, 0), true)
    }
  },
  () => {},
  false
)

// Blue team goal
new TriggerCube(
  120,
  -40,
  -350,
  5,
  10,
  13,
  (collidedWithEntity) => {
    // Only react to the ball
    if (collidedWithEntity.id === ball.entity.id) {
      redScore++ // Red team scores when ball enters blue team's goal
      sendChatMessage('⚽', '🔴 Red team scores! 🎉')
      updateScore()

      // Reset ball position after goal
      const body = ball.entity.getComponent(DynamicRigidBodyComponent).body
      body.setTranslation(
        new Rapier.Vector3(ballSpawnPosition.x, ballSpawnPosition.y, ballSpawnPosition.z),
        new Rapier.Quaternion(0, 0, 0, 1)
      )
      body.setLinvel(new Rapier.Vector3(0, 0, 0), true)
    }
  },
  () => {},
  false
)
