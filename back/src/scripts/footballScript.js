// Initialize world and ball
new MapWorld(
  'https://rawcdn.githack.com/iErcann/Notblox-Assets/f8b474a703930afb1caa82fd2bda4ca336a00a29/Stadium.glb'
)

const ballSpawnPosition = { x: 0, y: -15, z: -355 }
const ball = new Sphere(
  ballSpawnPosition.x,
  ballSpawnPosition.y,
  ballSpawnPosition.z,
  1.4,
  'default',
  'https://rawcdn.githack.com/iErcann/Notblox-Assets/f8b474a703930afb1caa82fd2bda4ca336a00a29/Ball.glb'
)
ball.entity.addComponent(
  new SpawnPositionComponent(
    ball.entity.id,
    ballSpawnPosition.x,
    ballSpawnPosition.y,
    ballSpawnPosition.z
  )
)

// Score display and management
const scoreText = new FloatingText('🔴 0 - 0 🔵', 0, 0, -450, 200)
let redScore = 0,
  blueScore = 0

// Ball collision handling
ball.entity.addComponent(
  new OnCollisionEnterEvent(ball.entity.id, (playerEntity) => {
    if (playerEntity.getComponent(PlayerComponent) && playerEntity.getComponent(InputComponent)) {
      const ballBody = ball.entity.getComponent(DynamicRigidBodyComponent).body
      const playerLookingDirection = playerEntity.getComponent(InputComponent).lookingYAngle
      const playerLookingDirectionVector = new Rapier.Vector3(
        -Math.cos(playerLookingDirection) * 500,
        0,
        -Math.sin(playerLookingDirection) * 500
      )
      ballBody.applyImpulse(playerLookingDirectionVector, true)
    }
  })
)

// Chat functionality
const chatEntity = EntityManager.getFirstEntityWithComponent(
  EntityManager.getInstance().getAllEntities(),
  ChatComponent
)

const sendChatMessage = (author, message) => {
  EventSystem.addEvent(new ChatMessageEvent(chatEntity.id, author, message))
}

const updateScore = () => {
  sendChatMessage('⚽', `Score: 🔴 Red ${redScore} - ${blueScore} Blue 🔵`)
  scoreText.updateText(`🔴 ${redScore} - ${blueScore} 🔵`)
}

// Initialize chat and score
sendChatMessage('⚽', 'Welcome to the football game!')
updateScore()

// Team spawn teleporters and coloring
function createTeamTrigger(x, y, z, color, spawnX) {
  return new TriggerCube(
    x,
    y,
    z,
    10,
    2,
    10,
    (collidedWithEntity) => {
      // If the player collides with the trigger, we change his color and teleport him to the stadium
      if (collidedWithEntity.getComponent(PlayerComponent)) {
        // Change the player color
        EventSystem.addEvent(new ColorEvent(collidedWithEntity.id, color))
        // Teleport the player to the spawn point
        collidedWithEntity
          .getComponent(DynamicRigidBodyComponent)
          .body.setTranslation(new Rapier.Vector3(spawnX, 5, -350), true)
      }
    },
    () => {},
    false // We don't want the trigger to be visible, put it to true if you want to debug its position
  )
}
// Create team triggers
createTeamTrigger(-24, -4, -29, '#f0513c', -80) // Red team
createTeamTrigger(24, -4, -29, '#3c9cf0', 80) // Blue team

// Goal handling
function handleGoal(scoringTeam) {
  if (scoringTeam === 'blue') blueScore++
  else redScore++

  sendChatMessage('⚽', `${scoringTeam === 'blue' ? '🔵 Blue' : '🔴 Red'} team scores! 🎉`)
  updateScore()

  const body = ball.entity.getComponent(DynamicRigidBodyComponent).body
  body.setTranslation(
    new Rapier.Vector3(ballSpawnPosition.x, ballSpawnPosition.y, ballSpawnPosition.z),
    new Rapier.Quaternion(0, 0, 0, 1)
  )
  body.setLinvel(new Rapier.Vector3(0, 0, 0), true)
}

// Create goal triggers
new TriggerCube(
  -120,
  -40,
  -350,
  5,
  10,
  13,
  (collidedWithEntity) => collidedWithEntity.id === ball.entity.id && handleGoal('blue'),
  () => {},
  false
)

new TriggerCube(
  120,
  -40,
  -350,
  5,
  10,
  13,
  (collidedWithEntity) => collidedWithEntity.id === ball.entity.id && handleGoal('red'),
  () => {},
  false
)

// Keep the commented key interactible part as requested
// // When the player is near the ball, he can shoot it
// // For that, we need to add a key interactible component to the ball
// // The front also needs to render a key icon above the ball
// // That's why the key interactible component is added to the network data component to be synced with the front
// const keyInteractibleComponent = new KeyInteractibleComponent(
//   ball.entity.id,
//   (interactingEntity) => {
//     // TODO : Shoot the ball
//     console.log('INTERACTED !', interactingEntity)
//   }
// )
// const networkDataComponent = ball.entity.getComponent(NetworkDataComponent)
// networkDataComponent.addComponent(keyInteractibleComponent)
// ball.entity.addComponent(keyInteractibleComponent)
