// Initialize world and ball
new MapWorld('https://notbloxo.fra1.cdn.digitaloceanspaces.com/Notblox-Assets/world/Stadium.glb')

const ballSpawnPosition = { x: 0, y: -20, z: -350 }

const sphereParams = {
  radius: 1.4,
  position: {
    x: ballSpawnPosition.x,
    y: ballSpawnPosition.y,
    z: ballSpawnPosition.z,
  },
  meshUrl: 'https://notbloxo.fra1.cdn.digitaloceanspaces.com/Notblox-Assets/base/Ball.glb',
  physicsProperties: {
    mass: 1.5,
    // Enable continuous collision detection to prevent the ball from going through the walls
    enableCcd: true,
    angularDamping: 0.3,
    linearDamping: 0.2,
  },
  colliderProperties: {
    friction: 0.2,
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

// Score display and management
const scoreText = new FloatingText('🔴 0 - 0 🔵', 0, 0, -450, 200)
let redScore = 0,
  blueScore = 0

// Chat functionality
const chatEntity = EntityManager.getFirstEntityWithComponent(
  EntityManager.getInstance().getAllEntities(),
  ChatComponent
)

// Message sending functions
function sendGlobalChatMessage(author, message) {
  EventSystem.addEvent(
    new MessageEvent(chatEntity.id, author, message, SerializedMessageType.GLOBAL_CHAT)
  )
}

function sendGlobalNotification(author, message) {
  EventSystem.addEvent(
    new MessageEvent(chatEntity.id, author, message, SerializedMessageType.GLOBAL_NOTIFICATION)
  )
}

function sendTargetedNotification(author, message, targetPlayerIds) {
  EventSystem.addEvent(
    new MessageEvent(
      chatEntity.id,
      author,
      message,
      SerializedMessageType.TARGETED_NOTIFICATION,
      targetPlayerIds
    )
  )
}

function sendTargetedChat(author, message, targetPlayerIds) {
  EventSystem.addEvent(
    new MessageEvent(
      chatEntity.id,
      author,
      message,
      SerializedMessageType.TARGETED_CHAT,
      targetPlayerIds
    )
  )
}

const updateScore = () => {
  sendGlobalChatMessage('⚽', `Score: 🔴 Red ${redScore} - ${blueScore} Blue 🔵`)
  scoreText.updateText(`🔴 ${redScore} - ${blueScore} 🔵`)
}

// Initialize chat and score
sendGlobalChatMessage('⚽', 'Football NotBlox.Online')
updateScore()

// Team spawn teleporters and coloring
function createTeamTrigger(x, y, z, color, spawnX) {
  return new TriggerCube(
    x,
    y,
    z,
    12,
    2,
    12,
    (collidedWithEntity) => {
      // If the player collides with the trigger, we change his color and teleport him to the stadium
      if (collidedWithEntity.getComponent(PlayerComponent)) {
        // Change the player color
        EventSystem.addEvent(new ColorEvent(collidedWithEntity.id, color))
        // Teleport the player to the spawn point
        // Teleport player to team spawn
        const playerBody = collidedWithEntity.getComponent(DynamicRigidBodyComponent).body
        playerBody.setTranslation(new Rapier.Vector3(spawnX, 5, -350), true)

        // Reset player velocity
        playerBody.setLinvel(new Rapier.Vector3(0, 0, 0), true)

        // Determine team info
        const isRedTeam = color === '#f0513c'
        const teamColor = isRedTeam ? 'red' : 'blue'
        const teamEmoji = isRedTeam ? '🔴' : '🔵'
        const playerName = collidedWithEntity.getComponent(TextComponent)?.text || 'Player'

        // Broadcast join message
        sendGlobalNotification(
          `${teamEmoji} New Player`,
          `${playerName} joined the ${teamColor} team`
        )
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

  // Send both chat message and global notification
  sendGlobalChatMessage('⚽', `${scoringTeam === 'blue' ? '🔵 Blue' : '🔴 Red'} team scores! 🎉`)
  sendGlobalNotification(
    '⚽ GOAL!',
    `${scoringTeam === 'blue' ? '🔵 Blue' : '🔴 Red'} team scores!`
  )
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

ScriptableSystem.update = (dt, entities) => {
  /**
   * Catch player connect events.
   */
  const playerAddedEvents = EventSystem.getEventsWrapped(ComponentAddedEvent, PlayerComponent)
  for (const event of playerAddedEvents) {
    sendTargetedNotification('⚽ Welcome to Football NotBlox!', 'Choose a team to get started', [
      event.entityId,
    ])
  }

  // Check if there are any players
  const hasPlayers = entities.some((entity) => entity.getComponent(PlayerComponent))

  if (!hasPlayers) {
    // No players are present. Reset the game
    sendGlobalChatMessage('⚽', 'No players, resetting game...')

    const ballBody = ball.entity.getComponent(DynamicRigidBodyComponent).body
    ballBody.setTranslation(
      new Rapier.Vector3(ballSpawnPosition.x, ballSpawnPosition.y, ballSpawnPosition.z),
      new Rapier.Quaternion(0, 0, 0, 1)
    )
    ballBody.setLinvel(new Rapier.Vector3(0, 0, 0), true)

    redScore = 0
    blueScore = 0
    updateScore()
  }
}

// When the player is near the ball, he can shoot it
// For that, we need to add a proximity prompt component to the ball
// The front also needs to render a proximity prompt above the ball

// That's why the proximity prompt component is added to the network data component to be synced with the front
const proximityPromptComponent = new ProximityPromptComponent(ball.entity.id, {
  text: 'Kick',
  onInteract: (playerEntity) => {
    const ballRigidbody = ball.entity.getComponent(DynamicRigidBodyComponent)
    const playerRotationComponent = playerEntity.getComponent(RotationComponent)

    if (ballRigidbody && playerRotationComponent && playerEntity.getComponent(InputComponent)) {
      // Convert rotation to direction vector
      const direction = playerRotationComponent.getForwardDirection()

      // Send targeted notification to the player who kicked the ball
      sendTargetedNotification('', 'You kicked the ball!', [playerEntity.id])

      // Calculate player looking direction
      const playerLookingDirectionVector = new Rapier.Vector3(
        direction.x * 750,
        0,
        direction.z * 750
      )

      ballRigidbody.body.applyImpulse(playerLookingDirectionVector, true)
    }
  },
  maxInteractDistance: 10,
  interactionCooldown: 2000,
  holdDuration: 0,
})
ball.entity.addNetworkComponent(proximityPromptComponent)
