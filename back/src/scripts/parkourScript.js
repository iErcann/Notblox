new MapWorld('https://notbloxo.fra1.cdn.digitaloceanspaces.com/Notblox-Assets/world/Obby.glb')

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

// Get the chat entity for sending messages
const chatEntity = EntityManager.getFirstEntityWithComponent(
  EntityManager.getInstance().getAllEntities(),
  ChatComponent
)

// Message sending functions
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

function sendGlobalChatMessage(author, message) {
  EventSystem.addEvent(
    new MessageEvent(chatEntity.id, author, message, SerializedMessageType.GLOBAL_CHAT)
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

// Create falling spheres for the parkour challenge
for (let i = 1; i <= 4; i++) {
  const fallingSpherePosition = {
    x: 263,
    y: 426 + i * 5,
    z: -986 - randomInt(0, -40),
  }

  const sphereParams = {
    position: fallingSpherePosition,
    radius: 4,
    physicsProperties: {
      enableCcd: true,
    },
  }
  const sphere = new Sphere(sphereParams)
  sphere.entity.addComponent(
    new SpawnPositionComponent(
      sphere.entity.id,
      fallingSpherePosition.x,
      fallingSpherePosition.y,
      fallingSpherePosition.z
    )
  )
  sphere.entity.addComponent(new ZombieComponent(sphere.entity.id))
}

// Periodic help message
let helpMessageTimer = 0
const HELP_MESSAGE_INTERVAL = 60 * 5 // Send help message every 5 minutes

// ScriptableSystem for checkpoint functionality
ScriptableSystem.update = (dt, entities) => {
  /**
   * Catch player disconnect events.
   */
  const playerRemovedEvents = EventSystem.getEventsWrapped(ComponentRemovedEvent, PlayerComponent)
  if (playerRemovedEvents.length > 0) {
    // Player left the game, we can add any cleanup here if needed
    sendGlobalChatMessage('👋', `Player left the obby parkour challenge!`)
  }

  /**
   * Catch player connect events.
   */
  const playerAddedEvents = EventSystem.getEventsWrapped(ComponentAddedEvent, PlayerComponent)
  for (const event of playerAddedEvents) {
    const playerId = event.entityId
    const playerEntity = EntityManager.getEntityById(entities, playerId)

    const position = playerEntity.getComponent(PositionComponent)
    const playerName = playerEntity.getComponent(PlayerComponent).name
    if (playerEntity && position) {
      // Add SpawnPositionComponent to the player with their current position
      playerEntity.addComponent(
        new SpawnPositionComponent(playerId, position.x, position.y, position.z)
      )

      // Send welcome message with checkpoint instructions
      sendTargetedChat(
        '🏁 Parkour Challenge',
        `Welcome ${playerName}! Use /cp command to save your current position as a checkpoint.`,
        [playerId]
      )
      sendTargetedNotification(
        '🏁 Parkour Challenge',
        `Welcome ${playerName}! Use /cp command to save your current position as a checkpoint.`,
        [playerId]
      )
    }
  }

  // Process chat messages for checkpoint commands
  const messageEvents = EventSystem.getEvents(MessageEvent)

  for (const event of messageEvents) {
    // Only process player messages (not system messages)
    if (event.messageType === SerializedMessageType.GLOBAL_CHAT) {
      const content = event.content.trim()

      // Check if message is a checkpoint command
      if (content.startsWith('/cp') || content.startsWith('/checkpoint')) {
        const playerId = event.entityId
        const playerEntity = EntityManager.getEntityById(entities, playerId)
        const position = playerEntity.getComponent(PositionComponent)
        if (playerEntity && position) {
          try {
            // Update the player's checkpoint position
            const spawnPos = playerEntity.getComponent(SpawnPositionComponent)
            if (spawnPos) {
              spawnPos.x = position.x
              spawnPos.y = position.y
              spawnPos.z = position.z

              // Send confirmation message to the player
              sendTargetedChat('🏁 Checkpoint', `Checkpoint set successfully!`, [playerId])
              sendTargetedNotification('🏁 Checkpoint', 'Checkpoint set successfully!', [playerId])
            } else {
              // If player somehow doesn't have SpawnPositionComponent, add it
              playerEntity.addComponent(
                new SpawnPositionComponent(playerId, position.x, position.y, position.z)
              )

              // Send confirmation message to the player
              sendTargetedChat('🏁 Checkpoint', `Checkpoint set successfully!`, [playerId])
              sendTargetedNotification('🏁 Checkpoint', 'Checkpoint set successfully!', [playerId])
            }
          } catch (error) {
            // Handle any errors that might occur
            console.error(`Error setting checkpoint for player ${playerId}:`, error)
            sendTargetedChat('❌ Error', 'Failed to set checkpoint. Please try again.', [playerId])
          }
        } else {
          // Player entity not found or doesn't have position component
          sendTargetedChat('❌ Error', 'Unable to set checkpoint. Please try again later.', [
            playerId,
          ])
        }
      } else if (content === '/help') {
        const playerId = event.entityId
        sendTargetedChat('🏁 Help Menu', 'Available commands: /cp, /checkpoint', [playerId])
        sendTargetedNotification('🏁 Help Menu', 'Available commands: /cp, /checkpoint', [playerId])
      }
    }
  }

  /**
   * Periodic help message
   */
  if (helpMessageTimer >= HELP_MESSAGE_INTERVAL) {
    sendGlobalChatMessage('🤖', 'Available commands: /help, /cp, /checkpoint')
    helpMessageTimer = 0
  } else {
    helpMessageTimer += dt / 1000
  }
}
