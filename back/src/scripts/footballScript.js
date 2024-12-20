// back/src/scripts/footballScript.js

new MapWorld('http://localhost:4001/Stadium.glb')

// Create the ball
const ball = new Sphere(0, -20, -185, 2)
ball.entity.addComponent(new SpawnPositionComponent(ball.entity.id, 0, -20, -185))

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
        .body.setTranslation(new Rapier.Vector3(-80, 5, -200), true)
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
        .body.setTranslation(new Rapier.Vector3(80, 5, -200), true)
    }
  },
  () => {},
  false
)

// Create trigger goals
// Red team goals
new TriggerCube(
  -140,
  -40,
  -185,
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
      body.setTranslation(new Rapier.Vector3(0, -35, -185), new Rapier.Quaternion(0, 0, 0, 1))
      body.setLinvel(new Rapier.Vector3(0, 0, 0), true)
    }
  },
  () => {},
  false
)

// Blue team goal
new TriggerCube(
  140,
  -40,
  -185,
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
      body.setTranslation(new Rapier.Vector3(0, -35, -185), new Rapier.Quaternion(0, 0, 0, 1))
      body.setLinvel(new Rapier.Vector3(0, 0, 0), true)
    }
  },
  () => {},
  false
)
