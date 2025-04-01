new MapWorld('https://notbloxo.fra1.cdn.digitaloceanspaces.com/Notblox-Assets/world/PetSim.glb')

const entityManager = EntityManager.getInstance()
const allEntities = entityManager.getAllEntities()
const chatEntity = EntityManager.getFirstEntityWithComponent(allEntities, ChatComponent)

// Player data tracking
// playerId: number, playerData: { coins, pets, joinDate, etc }
const playerData = new Map()

// Leaderboard display
const leaderboardText = new FloatingText('👑 LEADERBOARD 🏆', 0, 10, -250, 150)

function updateLeaderboard() {
  // Convert Map to array for sorting
  const entries = Array.from(playerData.entries())
  // Sort by coins (highest first)
  entries.sort((a, b) => b[1].coins - a[1].coins)

  // Format the leaderboard text with HTML
  let leaderboardString = '<b>✨ TOP PLAYERS ✨</b><br/>'
  entries.forEach(([playerId, data], index) => {
    const playerName = data.name
    const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '👤'
    leaderboardString += `${medal} ${playerName}: ${data.coins} coins (${data.pets.length} pets)<br/>`
  })

  // Update the floating text
  leaderboardText.updateText(leaderboardString)
}

function sendGlobalChatMessage(author, message) {
  EventSystem.addEvent(new MessageEvent(chatEntity.id, author, message, SerializedMessageType.GLOBAL_CHAT))
}

function sendGlobalNotification(author, message) {
  EventSystem.addEvent(new MessageEvent(chatEntity.id, author, message, SerializedMessageType.GLOBAL_NOTIFICATION))
}

function sendTargetedNotification(author, message, targetPlayerIds) {
  EventSystem.addEvent(new MessageEvent(chatEntity.id, author, message, SerializedMessageType.TARGETED_NOTIFICATION, targetPlayerIds))
}

function sendTargetedChat(author, message, targetPlayerIds) {
  EventSystem.addEvent(new MessageEvent(chatEntity.id, author, message, SerializedMessageType.TARGETED_CHAT, targetPlayerIds))
}

function initializePlayerData(playerId) {
  const playerEntity = EntityManager.getEntityById(allEntities, playerId)
  if (!playerEntity) return
  const nameComponent = playerEntity.getComponent(TextComponent)
  const name = nameComponent.text
  return {
    coins: 0,
    pets: [],
    joinDate: new Date(),
    lastActive: new Date(),
    level: 1,
    experience: 0,
    name,
  }
}

function getPlayerData(playerId) {
  if (!playerData.has(playerId)) {
    playerData.set(playerId, initializePlayerData(playerId))
  }
  return playerData.get(playerId)
}

function getPlayerCoins(playerId) {
  return getPlayerData(playerId).coins
}

function addPlayerCoins(playerId, amount) {
  const data = getPlayerData(playerId)
  if (!data) return
  data.coins += amount
  data.lastActive = new Date()
  updateLeaderboard()
  return data.coins
}

function addPlayerPet(playerId, pet) {
  const data = getPlayerData(playerId)
  if (!data) return
  data.pets.push(pet)
  data.lastActive = new Date()
  updateLeaderboard()
  return data.pets.length
}

function teleportPlayer(player, position) {
  const body = player.getComponent(DynamicRigidBodyComponent).body
  body.setTranslation(
    new Rapier.Vector3(position.x, position.y, position.z),
    new Rapier.Quaternion(0, 0, 0, 1)
  )
  body.setLinvel(new Rapier.Vector3(0, 0, 0), true)
}

function createTriggerArea(posA, posB, onTrigger = null) {
  // Calculate center position between the two points
  const centerX = (posA.x + posB.x) / 2
  const centerY = (posA.y + posB.y) / 2
  const centerZ = (posA.z + posB.z) / 2

  // Calculate dimensions based on distance between points
  const width = Math.abs(posA.x - posB.x) / 2
  const height = Math.abs(posA.y - posB.y) / 2
  const depth = Math.abs(posA.z - posB.z) / 2

  new TriggerCube(
    centerX,
    centerY,
    centerZ,
    width,
    height,
    depth,
    (collidedWithEntity) => {
      if (collidedWithEntity.getComponent(PlayerComponent) && onTrigger) {
        onTrigger(collidedWithEntity)
      }
    },
    () => {},
    false
  )
}

// Initialize chicken pet shop proximity button
const chickenShopProximityButton = new Cube({
  position: { x: -0.027, y: -15.877, z: 78.238 },

  size: {
    width: 0.1,
    height: 0.1,
    depth: 0.1,
  },

  // Make it non-physical
  colliderProperties: {
    isSensor: true,
    friction: 0,
    restitution: 0,
  },
  physicsProperties: {
    mass: 0,
    // Make it static (hacky way because this actually is a dynamic rb. Could be changed in the future to a kinematic)
    gravityScale: 0,
  },
})

// Add proximity prompt for buying chickens
const chickenPrompt = new ProximityPromptComponent(chickenShopProximityButton.entity.id, {
  text: '🐔 Buy Chicken (50 coins)',
  onInteract: (playerEntity) => {
    const playerId = playerEntity.id
    const playerData = getPlayerData(playerId)
    const playerName = playerData.name

    if (playerData && playerData.coins >= 50) {
      // Add chicken to player's pets
      addPlayerCoins(playerId, -50) // Deduct cost
      const pet = {
        type: 'chicken',
        bonus: 3,
        purchaseDate: new Date(),
      }
      addPlayerPet(playerId, pet)

      // Calculate total bonus
      const totalBonus = playerData.pets.reduce((sum, pet) => sum + pet.bonus, 0)
      sendTargetedNotification('🐔', `You bought a chicken! Total chickens: ${playerData.pets.length} (${totalBonus} coins/jump)`, [playerId])
      sendGlobalChatMessage('🐔', `${playerName} bought a chicken!`, [playerId])
    } else {
      sendTargetedChat('❌', `You need ${50 - playerData.coins} more coins to buy a chicken!`, [playerId])
      sendTargetedNotification('❌', `You need ${50 - playerData.coins} more coins to buy a chicken!`, [playerId])
    }
  },
  maxInteractDistance: 20,
  interactionCooldown: 1000,
  holdDuration: 0,
})
chickenShopProximityButton.entity.addNetworkComponent(chickenPrompt)

// Create trigger area for coins
createTriggerArea(
  { x: 54.243263244628906, y: -16.326662540435791, z: -134.82362365722656 + 25 },
  { x: -57.9406623840332, y: -5.326661586761475, z: -244.29600524902344 + 25 },
  (player) => {
    // Add coins when player enters trigger area
    const playerData = getPlayerData(player.id)
    if (!playerData) return
    const bonus = playerData.pets.reduce((sum, pet) => sum + pet.bonus, 0) || 1
    const newCoins = addPlayerCoins(player.id, bonus)
    sendTargetedNotification('🪙 Coins', `You received ${bonus} coins!`, [player.id])
    sendTargetedChat(`+🪙 ${bonus} coins`, `Total: ${newCoins} 🪙`, [player.id])
  }
)

// Example with custom behavior
/*
createTriggerArea(
  { x: 0, y: 0, z: 0 },
  { x: 10, y: 0, z: 0 },
  (player) => {
    // Custom behavior here
    sendChatMessage('Trigger', 'Player entered the trigger!')
  }
)
*/

// Periodic help message
let helpMessageTimer = 0
const HELP_MESSAGE_INTERVAL = 60 * 5 // Send help message every 5 minutes

// ScriptableSystem
ScriptableSystem.update = (dt, entities) => {
  /**
   * Catch player disconnect events.
   */
  const playerRemovedEvents = EventSystem.getEventsWrapped(ComponentRemovedEvent, PlayerComponent)
  for (const event of playerRemovedEvents) {
    const playerId = event.entityId
    const data = getPlayerData(playerId)
    if (data && data.coins) {
      sendGlobalChatMessage(
        '👋',
        `Player ${playerId.toString().substring(0, 4)} disconnected. Total coins: ${
          data.coins
          }, Pets: ${data.pets.length}`
      )
    }
    playerData.delete(playerId)
  }

  /**
   * Catch player connect events.
   */
  const playerAddedEvents = EventSystem.getEventsWrapped(ComponentAddedEvent, PlayerComponent)
  for (const event of playerAddedEvents) {
    const playerId = event.entityId
    initializePlayerData(playerId)
  }

  /**
   * Catch chat events
   */
  const messageEvents = EventSystem.getEvents(MessageEvent)
  for (const event of messageEvents) {
    // Only catch global chat messages
    if (event.messageType !== SerializedMessageType.GLOBAL_CHAT) {
      continue
    }
    const senderName = event.sender
    const content = event.content

    // Handle commands
    if (content.startsWith('/')) {
      const args = content.split(' ')
      const command = args[0].toLowerCase()

      if (command === '/help') {
        sendGlobalChatMessage('🤖', 'Available commands: /help, /coins, /give <player name> <amount>, /stats')
      } else if (command === '/coins') {
        const playerCoins = getPlayerCoins(event.entityId)
        sendGlobalChatMessage('💰', `${senderName} have ${playerCoins} coins`)
      } else if (command === '/give' && args.length >= 3) {
        const playerName = args.slice(1, -1).join(' ')
        const amount = parseInt(args[args.length - 1])

        // Validate amount
        if (isNaN(amount) || amount <= 0) {
          sendTargetedChat('❌', 'Please enter a valid positive number', [event.entityId])
          sendTargetedNotification('❌', 'Please enter a valid positive number', [event.entityId])
          continue
        }

        // Check if player has enough coins
        const senderCoins = getPlayerCoins(event.entityId)
        if (senderCoins < amount) {
          sendTargetedChat('❌', `You don't have enough coins. Current balance: ${senderCoins}`, [event.entityId])
          sendTargetedNotification('❌', `You don't have enough coins. Current balance: ${senderCoins}`, [event.entityId])
          continue
        }

        // Find player by name
        const targetPlayerId = Array.from(playerData.keys()).find((id) => {
          const data = playerData.get(id)
          return data.name === playerName
        })

        if (!targetPlayerId) {
          sendTargetedChat('❌', `"${playerName}" not found`, [event.entityId])
          sendTargetedNotification('❌', `"${playerName}" not found`, [event.entityId])
          continue
        }

        // Transfer coins
        addPlayerCoins(event.entityId, -amount) // Remove from sender
        addPlayerCoins(targetPlayerId, amount) // Add to recipient
        sendGlobalChatMessage('💰', `${senderName} gave ${amount} coins to ${playerName}`)
      } else if (command === '/pos') {
        const entity = EntityManager.getEntityById(entities, event.entityId)
        const position = entity.getComponent(PositionComponent)
        sendGlobalChatMessage('📍', `Position: x=${position.x}, y=${position.y}, z=${position.z}`)
      } else if (command === '/stats') {
        // Show coins, pets, playtime
        const playerData = getPlayerData(event.entityId)
        if (!playerData) continue
        const coins = playerData.coins
        const pets = playerData.pets
        const playtime = (Date.now() - playerData.joinDate) / 1000
        const playtimeString = `${Math.floor(playtime / 3600)}h ${Math.floor((playtime % 3600) / 60)}m`
        // Display all stats in a single message
        sendGlobalChatMessage('📊', `${playerData.name} stats: 💰 ${coins} coins | 🐾 ${pets.length} pets | ⏱️ ${playtimeString}`)
      }
    }
  }
  /**
   * Periodic help message
   */
  if (helpMessageTimer >= HELP_MESSAGE_INTERVAL) {
    sendGlobalChatMessage('🤖', 'Available commands: /help, /coins, /give <player name> <amount>, /stats')
    helpMessageTimer = 0
  } else {
    helpMessageTimer += dt / 1000
  }
}
