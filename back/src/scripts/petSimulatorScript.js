new MapWorld('https://notbloxo.fra1.cdn.digitaloceanspaces.com/Notblox-Assets/world/PetSim.glb')

const s3Base = 'https://notbloxo.fra1.cdn.digitaloceanspaces.com/Notblox-Assets/animal/'
const PET_TYPES = {
  CAT: {
    name: 'Cat',
    rarity: 'common', // common, uncommon, rare, epic, legendary
    bonus: 2,
    url: `${s3Base}Cat.glb`,
    size: 1,
  },
  CHICK: {
    name: 'Chick',
    rarity: 'common',
    bonus: 1,
    url: `${s3Base}Chick.glb`,
    size: 1,
  },
  CHICKEN: {
    name: 'Chicken',
    rarity: 'common',
    bonus: 3,
    url: `${s3Base}Chicken.glb`,
    size: 1,
  },
  DOG: {
    name: 'Dog',
    rarity: 'uncommon',
    bonus: 5,
    url: `${s3Base}Dog.glb`,
    size: 1,
  },
  HORSE: {
    name: 'Horse',
    rarity: 'rare',
    bonus: 10,
    url: `${s3Base}Horse.glb`,
    size: 1,
  },
  PIG: {
    name: 'Pig',
    rarity: 'uncommon',
    bonus: 4,
    url: `${s3Base}Pig.glb`,
    size: 1,
  },
  RACCOON: {
    name: 'Raccoon',
    rarity: 'rare',
    bonus: 8,
    url: `${s3Base}Raccoon.glb`,
    size: 1,
  },
  SHEEP: {
    name: 'Sheep',
    rarity: 'uncommon',
    bonus: 6,
    url: `${s3Base}Sheep.glb`,
    size: 1,
  },
  WOLF: {
    name: 'Wolf',
    rarity: 'epic',
    bonus: 15,
    url: `${s3Base}Wolf.glb`,
    size: 1,
  },
  GOLDEN_WOLF: {
    name: 'Golden Wolf',
    rarity: 'legendary',
    bonus: 30,
    url: `${s3Base}Wolf.glb`, // Same model but we'll add a golden effect with size
    size: 2,
  },
}

// Rarity colors and chances
const RARITY_DATA = {
  common: { color: '#AAAAAA', chance: 60, emoji: '⚪' },
  uncommon: { color: '#55AA55', chance: 25, emoji: '🟢' },
  rare: { color: '#5555FF', chance: 10, emoji: '🔵' },
  epic: { color: '#AA00AA', chance: 4, emoji: '🟣' },
  legendary: { color: '#FFAA00', chance: 1, emoji: '🟠' },
}

// Random rewards when collecting coins
const RANDOM_REWARDS = [
  { type: 'coins', amount: 10, chance: 30, message: 'Found a small coin stash!' },
  { type: 'coins', amount: 50, chance: 10, message: 'Found a medium coin stash!' },
  { type: 'coins', amount: 200, chance: 2, message: 'Found a large coin stash!' },
  { type: 'coins', amount: 1000, chance: 1, message: 'JACKPOT! Found a huge coin stash!' },
  { type: 'egg', chance: 1, message: 'Found a mystery egg!' },
]

// Egg shop configuration
const EGG_TYPES = {
  BASIC: {
    name: 'Basic Egg',
    price: 100,
    description: 'Contains mostly common pets',
    emoji: '🥚',
    rarityModifier: {
      // Increases chances for specific rarities
      common: 1.2,
      uncommon: 0.9,
      rare: 0.8,
      epic: 0.5,
      legendary: 0.2,
    },
  },
  SPOTTED: {
    name: 'Spotted Egg',
    price: 350,
    description: 'Higher chance for uncommon and rare pets',
    emoji: '🥚🟢',
    rarityModifier: {
      common: 0.5,
      uncommon: 1.5,
      rare: 1.2,
      epic: 0.8,
      legendary: 0.5,
    },
  },
  GOLDEN: {
    name: 'Golden Egg',
    price: 1000,
    description: 'Much higher chance for rare and epic pets',
    emoji: '🥚✨',
    rarityModifier: {
      common: 0.2,
      uncommon: 0.8,
      rare: 1.5,
      epic: 1.5,
      legendary: 1.0,
    },
  },
  CRYSTAL: {
    name: 'Crystal Egg',
    price: 2500,
    description: 'High chance for epic and legendary pets',
    emoji: '🥚💎',
    rarityModifier: {
      common: 0.1,
      uncommon: 0.3,
      rare: 0.7,
      epic: 2.0,
      legendary: 3.0,
    },
  },
}

// Pet upgrade configuration
const LEVEL_MULTIPLIERS = {
  1: 1.0, // Base level
  2: 1.5, // 50% increase
  3: 2.0, // 100% increase
  4: 3.0, // 200% increase
  5: 4.0, // 300% increase
  6: 6.0, // 500% increase
  7: 8.0, // 700% increase
  8: 12.0, // 1100% increase
  9: 18.0, // 1700% increase
  10: 25.0, // 2400% increase
}

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

    // Count legendary pets
    const legendaryCount = data.pets.filter((pet) => pet.rarity === 'legendary').length
    const legendaryBadge = legendaryCount > 0 ? `⭐${legendaryCount}` : ''

    leaderboardString += `${medal} ${playerName}: ${data.coins} coins | 🐾 ${data.pets.length} pets ${legendaryBadge}<br/>`
  })

  // Update the floating text
  leaderboardText.updateText(leaderboardString)
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

function initializePlayerData(playerId) {
  const playerEntity = EntityManager.getEntityById(allEntities, playerId)
  if (!playerEntity) return

  // Get player name from PlayerComponent instead of TextComponent
  const playerComponent = playerEntity.getComponent(PlayerComponent)
  const name = playerComponent ? playerComponent.name : `Player${playerId}`

  return {
    coins: 10000000,
    pets: [],
    eggs: 1, // Start with 1 egg
    joinDate: new Date(),
    lastActive: new Date(),
    level: 1,
    name,
    selectedPetIndex: -1, // For tracking which pet is selected for upgrade
    eggInventory: {},
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

function addPlayerEgg(playerId, amount = 1, eggType = 'BASIC') {
  const data = getPlayerData(playerId)
  if (!data) return

  // Add the egg with its type
  if (!data.eggInventory) {
    data.eggInventory = {}
  }

  data.eggInventory[eggType] = (data.eggInventory[eggType] || 0) + amount
  data.eggs += amount
  data.lastActive = new Date()

  return data.eggs
}

function addPlayerPet(playerId, pet) {
  const data = getPlayerData(playerId)
  if (!data) return

  // Add level information to the pet if it doesn't exist
  if (!pet.level) {
    pet.level = 1
  }

  // Calculate the actual bonus based on pet level
  pet.baseBonus = pet.bonus // Store original base bonus
  pet.bonus = Math.round(pet.baseBonus * LEVEL_MULTIPLIERS[pet.level])

  data.pets.push(pet)
  data.lastActive = new Date()
  updateLeaderboard()

  // Spawn the pet companion
  spawnPetCompanion(playerId, pet)

  return data.pets.length
}

// Function to spawn a pet companion for a player
function spawnPetCompanion(playerId, pet) {
  const playerEntity = EntityManager.getEntityById(allEntities, playerId)
  if (!playerEntity) return

  // Get pet data
  const petData = PET_TYPES[pet.type]
  if (!petData) return

  // Create companion with level in name
  const levelIndicator = pet.level > 1 ? ` Lvl ${pet.level}` : ''
  new OrbitalCompanion({
    // Spawn position
    position: { x: 0, y: 0, z: 0 },
    meshUrl: petData.url,
    targetEntityId: playerEntity.id,
    // Follow offset
    offset: { x: 0, y: 0, z: 0 }, // Y offset makes it float above player
    name: getRarityColoredText(`${petData.name}${levelIndicator}`, pet.rarity),
    size: petData.size * (1 + (pet.level - 1) * 0.15), // Grow slightly with level
  })
}

// Function to get colored text based on rarity
function getRarityColoredText(text, rarity) {
  const rarityInfo = RARITY_DATA[rarity] || RARITY_DATA.common
  return `${rarityInfo.emoji} ${text}`
}

// Function to randomly select a pet type based on rarity chances, with egg modifier
function getRandomPetType(eggType = 'BASIC') {
  // Get egg rarity modifiers
  const eggData = EGG_TYPES[eggType] || EGG_TYPES.BASIC
  const rarityModifiers = eggData.rarityModifier

  // Roll for rarity first, with egg's modifier applied
  const rarityRoll = Math.random() * 100
  let selectedRarity = 'common'
  let cumulativeChance = 0

  // Apply egg's rarity modifiers to the chances
  const modifiedRarityData = {}
  let totalModifiedChance = 0

  for (const [rarity, data] of Object.entries(RARITY_DATA)) {
    const modifier = rarityModifiers[rarity] || 1.0
    const modifiedChance = data.chance * modifier
    modifiedRarityData[rarity] = { ...data, modifiedChance }
    totalModifiedChance += modifiedChance
  }

  // Normalize chances to total 100%
  for (const [rarity, data] of Object.entries(modifiedRarityData)) {
    const normalizedChance = (data.modifiedChance / totalModifiedChance) * 100
    cumulativeChance += normalizedChance

    if (rarityRoll <= cumulativeChance) {
      selectedRarity = rarity
      break
    }
  }

  // Get all pets of the selected rarity
  const petsOfRarity = Object.entries(PET_TYPES).filter(([_, pet]) => pet.rarity === selectedRarity)

  // Select a random pet from the rarity group
  const randomIndex = Math.floor(Math.random() * petsOfRarity.length)
  return petsOfRarity[randomIndex][0]
}

// Function to check if player already has this pet type and level it up if found
function findExistingPet(playerId, petType) {
  const data = getPlayerData(playerId)
  if (!data || !data.pets) return null

  // Find the first pet of this type
  const existingPetIndex = data.pets.findIndex((pet) => pet.type === petType)

  if (existingPetIndex >= 0) {
    return {
      pet: data.pets[existingPetIndex],
      index: existingPetIndex,
    }
  }

  return null
}

// Function to level up an existing pet
function levelUpPet(playerId, petIndex) {
  const data = getPlayerData(playerId)
  if (!data || !data.pets || !data.pets[petIndex]) return null

  const pet = data.pets[petIndex]
  const currentLevel = pet.level || 1
  const nextLevel = currentLevel + 1

  if (nextLevel > 10) {
    // Already max level, give bonus coins instead
    const maxLevelBonus = 500
    addPlayerCoins(playerId, maxLevelBonus)
    return { pet, maxLevelBonus }
  }

  // Update pet level and bonus
  pet.level = nextLevel
  const oldBonus = pet.bonus
  pet.bonus = Math.round(pet.baseBonus * LEVEL_MULTIPLIERS[nextLevel])

  // Update the existing pet companion with new level info instead of removing it
  const playerEntity = EntityManager.getEntityById(allEntities, playerId)
  if (playerEntity) {
    // Find the companion entities following this player
    const companionEntities = allEntities.filter((entity) => {
      const followComponent = entity.getComponent(FollowTargetComponent)
      return followComponent && followComponent.targetEntityId === playerId
    })

    // Update the specific pet if we can identify it by index
    if (companionEntities[petIndex]) {
      const petData = PET_TYPES[pet.type]
      if (petData) {
        // Update the pet's text component with new level
        const textComponent = companionEntities[petIndex].getComponent(TextComponent)
        if (textComponent) {
          const levelIndicator = pet.level > 1 ? ` Lvl ${pet.level}` : ''
          textComponent.text = getRarityColoredText(`${petData.name}${levelIndicator}`, pet.rarity)
          textComponent.updated = true
        }

        // Update the pet's size component
        const sizeComponent = companionEntities[petIndex].getComponent(SingleSizeComponent)
        if (sizeComponent) {
          // Calculate the size growth factor based on level
          const baseSize = petData.size
          const growthPerLevel = 0.05
          const levelBonus = (pet.level - 1) * growthPerLevel
          const sizeMultiplier = 1 + levelBonus

          // Apply the calculated size
          sizeComponent.size = baseSize * sizeMultiplier
          sizeComponent.updated = true
        }
      }
    } else {
      // If pet companion entity not found, spawn a new one
      spawnPetCompanion(playerId, pet)
    }
  }

  return {
    pet,
    bonusIncrease: pet.bonus - oldBonus,
    newLevel: nextLevel,
  }
}

// Initialize separate egg shops for each egg type
Object.entries(EGG_TYPES).forEach(([eggType, eggData], index) => {
  // Position each shop in a line, spaced out from each other
  const xPos = index * 16 // Spread them out by 4 units, starting at -4

  const eggShop = new Cube({
    position: { x: xPos - 50, y: -15, z: 130.238 },
    size: {
      width: 2,
      height: 2,
      depth: 2,
    },
    colliderProperties: {
      isSensor: true,
    },
    physicsProperties: {
      mass: 0,
      gravityScale: 0,
    },
    // name: eggData.name,
  })

  // Add proximity prompt for buying this specific egg type
  const eggShopPrompt = new ProximityPromptComponent(eggShop.entity.id, {
    text: `${eggData.emoji} Buy ${eggData.name} (${eggData.price} coins)`,
    onInteract: (playerEntity) => {
      const playerId = playerEntity.id
      const data = getPlayerData(playerId)

      if (data.coins >= eggData.price) {
        // Deduct coins and add egg
        addPlayerCoins(playerId, -eggData.price)
        addPlayerEgg(playerId, 1, eggType)

        sendTargetedNotification(
          `${eggData.emoji} Purchased!`,
          `You bought a ${eggData.name} for ${eggData.price} coins! ${eggData.description}`,
          [playerId]
        )

        sendTargetedChat(
          `${eggData.emoji} Purchased!`,
          `You now have ${data.eggs} eggs. Go to the hatching station to use them!`,
          [playerId]
        )
      } else {
        sendTargetedChat(
          '❌ Not enough coins',
          `You need ${eggData.price - data.coins} more coins to buy this egg!`,
          [playerId]
        )
      }
    },
    interactionCooldown: 1000,
    holdDuration: 0,
    maxInteractDistance: 10,
  })
  eggShop.entity.addNetworkComponent(eggShopPrompt)
})

// Initialize egg hatching station
const eggHatchingStation = new Cube({
  position: { x: -0.027, y: -15.877, z: 80.238 },
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
    gravityScale: 0,
  },
})

// Add proximity prompt for hatching eggs
const eggHatchPrompt = new ProximityPromptComponent(eggHatchingStation.entity.id, {
  text: '🥚 Hatch Egg',
  onInteract: (playerEntity) => {
    const playerId = playerEntity.id
    const data = getPlayerData(playerId)
    const playerName = data.name

    if (data && data.eggs >= 1) {
      // Auto-select the next egg to hatch
      let selectedEggType = 'BASIC' // Default if using old data structure

      // If player has specific egg types, select the rarest one first
      if (data.eggInventory && Object.keys(data.eggInventory).length > 0) {
        // Order of rarity (from rarest to most common)
        const rarityOrder = ['CRYSTAL', 'GOLDEN', 'SPOTTED', 'BASIC']

        // Find the rarest egg type the player has
        for (const eggType of rarityOrder) {
          if (data.eggInventory[eggType] && data.eggInventory[eggType] > 0) {
            selectedEggType = eggType
            break
          }
        }

        // If no eggs found in the priority order, pick the first available
        if (!data.eggInventory[selectedEggType] || data.eggInventory[selectedEggType] <= 0) {
          for (const [eggType, count] of Object.entries(data.eggInventory)) {
            if (count > 0) {
              selectedEggType = eggType
              break
            }
          }
        }

        // Use the egg
        data.eggInventory[selectedEggType]--
        data.eggs--
      } else {
        data.eggs--
      }

      // Get the egg data for better feedback
      const eggData = EGG_TYPES[selectedEggType] || EGG_TYPES.BASIC

      // Determine which pet they get (random based on rarity with egg modifier)
      const petType = getRandomPetType(selectedEggType)
      const petData = PET_TYPES[petType]

      // Check if player already has this pet
      const existingPet = findExistingPet(playerId, petType)

      if (existingPet) {
        console.log('Pet already exists')
        // Level up existing pet instead of creating a new one
        const result = levelUpPet(playerId, existingPet.index)

        if (result.maxLevelBonus) {
          // Pet was already max level
          sendTargetedNotification(
            '✨ Max Level Pet!',
            `Your ${petData.name} is already max level! You received ${result.maxLevelBonus} bonus coins instead!`,
            [playerId]
          )

          sendTargetedChat('✨ Max Level Pet!', `Received ${result.maxLevelBonus} bonus coins!`, [
            playerId,
          ])
        } else {
          // Pet leveled up
          sendTargetedNotification(
            '⬆️ Pet Leveled Up!',
            `Your ${eggData.emoji} ${eggData.name} upgraded your ${petData.name} to level ${result.newLevel}! Bonus increased by +${result.bonusIncrease} coins/jump.`,
            [playerId]
          )

          sendTargetedChat(
            '⬆️ Pet Leveled Up!',
            `Level ${result.newLevel} ${petData.name} now gives +${result.pet.bonus} coins per jump!`,
            [playerId]
          )

          // If upgraded to a high level, announce it to create social proof
          if (result.newLevel >= 8) {
            sendGlobalChatMessage(
              '🌟',
              `${playerName} leveled up their ${petData.name} to level ${result.newLevel}!`
            )
          }
        }
      } else {
        console.log('Pet does not exist')
        // Add new pet to player's collection
        const pet = {
          type: petType,
          bonus: petData.bonus,
          rarity: petData.rarity,
          level: 1,
          purchaseDate: new Date(),
        }
        addPlayerPet(playerId, pet)

        // Send appropriate notifications based on rarity
        const rarityInfo = RARITY_DATA[petData.rarity]
        const hatchMessage = `Your ${eggData.emoji} ${eggData.name} hatched into a ${rarityInfo.emoji} ${petData.name}! (${petData.bonus} coins/jump)`

        sendTargetedNotification(`🥚 Hatched!`, hatchMessage, [playerId])

        // For rare or higher pets, broadcast to everyone to create FOMO
        if (
          petData.rarity === 'rare' ||
          petData.rarity === 'epic' ||
          petData.rarity === 'legendary'
        ) {
          const globalMessage = `${playerName} just hatched a ${
            rarityInfo.emoji
          } ${petData.rarity.toUpperCase()} ${petData.name} from a ${eggData.name}!`
          sendGlobalChatMessage('🎉', globalMessage)

          // Special extra notification for legendary pets
          if (petData.rarity === 'legendary') {
            sendGlobalNotification(
              '⭐ LEGENDARY PET',
              `${playerName} hatched a LEGENDARY ${petData.name}! Everyone gets 50 coins!`
            )

            // Give everyone a small bonus when someone gets a legendary (creates positive social engagement)
            Array.from(playerData.keys()).forEach((id) => {
              addPlayerCoins(id, 50)
              sendTargetedChat('🎁', `${playerName} found a legendary pet! You got 50 coins!`, [id])
            })
          }
        }
      }

      // Tell the player how many eggs they have left
      if (data.eggs > 0) {
        sendTargetedChat('🥚', `You have ${data.eggs} eggs remaining.`, [playerId])
      }
    } else {
      sendTargetedChat(
        '❌',
        `You don't have any eggs to hatch! Find eggs by jumping in the play area or buy them at the shop.`,
        [playerId]
      )
      sendTargetedNotification(
        '❌ No eggs',
        `You don't have any eggs to hatch! Find eggs by jumping in the play area or buy them at the shop.`,
        [playerId]
      )
    }
  },
  interactionCooldown: 1000,
  holdDuration: 0,
  maxInteractDistance: 30,
})
eggHatchingStation.entity.addNetworkComponent(eggHatchPrompt)

function getRandomReward() {
  const rewardRoll = Math.random() * 100
  let cumulativeChance = 0

  for (const reward of RANDOM_REWARDS) {
    cumulativeChance += reward.chance
    if (rewardRoll <= cumulativeChance) {
      return reward
    }
  }

  // Fallback
  return RANDOM_REWARDS[0]
}

// Create trigger area for coins and random rewards
createTriggerArea(
  { x: 54.243263244628906, y: -16.326662540435791, z: -134.82362365722656 + 25 },
  { x: -57.9406623840332, y: -5.326661586761475, z: -244.29600524902344 + 25 },
  (player) => {
    // Add coins when player enters trigger area
    const playerData = getPlayerData(player.id)
    if (!playerData) return

    // Base coins from pets
    const bonus = playerData.pets.reduce((sum, pet) => sum + pet.bonus, 0) || 1
    const newCoins = addPlayerCoins(player.id, bonus)

    // Show basic coin notification
    sendTargetedNotification(`${newCoins} 💰`, `You received ${bonus} coins!`, [player.id])
    sendTargetedChat(`+💰 ${bonus} coins`, `Total: ${newCoins} 💰`, [player.id])

    // Random chance for bonus rewards (about 15% chance)
    if (Math.random() < 0.15) {
      const reward = getRandomReward()

      if (reward.type === 'coins') {
        // Bonus coins
        const bonusCoins = reward.amount
        addPlayerCoins(player.id, bonusCoins)
        sendTargetedNotification(`🎁 BONUS!`, `${reward.message} +${bonusCoins} coins!`, [
          player.id,
        ])
        sendTargetedChat(`🎁 BONUS!`, `${reward.message} +${bonusCoins} coins!`, [player.id])
      } else if (reward.type === 'egg') {
        // Found an egg
        addPlayerEgg(player.id, 1)
        const eggCount = playerData.eggs
        sendTargetedNotification(
          `🥚 EGG FOUND!`,
          `${reward.message} You now have ${eggCount} eggs.`,
          [player.id]
        )
        sendTargetedChat(`🥚 EGG FOUND!`, `${reward.message} Go to the hatching station!`, [
          player.id,
        ])

        // Small chance to announce egg finds to create excitement
        if (Math.random() < 0.3) {
          sendGlobalChatMessage('🥚', `${playerData.name} found a mystery egg!`)
        }
      }
    }
  }
)

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
        `${data.name} disconnected. Total coins: ${data.coins}, Pets: ${data.pets.length}`
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

    // Initialize player data
    const data = initializePlayerData(playerId)
    playerData.set(playerId, data)

    // Welcome messages
    sendTargetedNotification(
      '🐾 Welcome to Pet Simulator!',
      'Jump in the play area to collect coins and find eggs!',
      [playerId]
    )
    sendTargetedChat(
      '🐾 Welcome to Pet Simulator!',
      'Jump in the play area to collect coins and find eggs!',
      [playerId]
    )

    // Helpful tips with delay
    setTimeout(() => {
      sendTargetedNotification(
        '🥚 Tips',
        'Find eggs to hatch pets! Rarer pets give more coins per jump!',
        [playerId]
      )
      sendTargetedChat('🥚 Tips', 'Find eggs to hatch pets! Rarer pets give more coins per jump!', [
        playerId,
      ])
    }, 5000)

    // Spawn existing pets for reconnecting players
    if (data.pets && data.pets.length > 0) {
      setTimeout(() => {
        sendTargetedChat('🐾', `Respawning your ${data.pets.length} pets...`, [playerId])
        data.pets.forEach((pet) => spawnPetCompanion(playerId, pet))
      }, 2000)
    }

    // Give a starter egg to new players
    if (data.pets.length === 0 && data.eggs === 0) {
      addPlayerEgg(playerId, 1)
      setTimeout(() => {
        sendTargetedNotification(
          '🎁 Welcome Gift',
          'You received 1 mystery egg! Visit the hatching station to use it!',
          [playerId]
        )
        sendTargetedChat(
          '🎁 Welcome Gift',
          'You received 1 mystery egg! Visit the hatching station to use it!',
          [playerId]
        )
      }, 10000)
    }
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
        sendGlobalChatMessage(
          '🤖',
          'Available commands: /help, /coins, /eggs, /pets, /give <player name> <amount>, /stats'
        )
      } else if (command === '/coins') {
        const playerCoins = getPlayerCoins(event.entityId)
        sendGlobalChatMessage('💰', `${senderName} has ${playerCoins} coins`)
      } else if (command === '/eggs') {
        const playerData = getPlayerData(event.entityId)
        sendGlobalChatMessage('🥚', `${senderName} has ${playerData.eggs} eggs`)
      } else if (command === '/pets') {
        const playerData = getPlayerData(event.entityId)
        const petsByRarity = {}

        // Count pets by rarity
        playerData.pets.forEach((pet) => {
          petsByRarity[pet.rarity] = (petsByRarity[pet.rarity] || 0) + 1
        })

        // Format pet counts
        let petMessage = `${senderName}'s pets (${playerData.pets.length} total):`
        for (const [rarity, count] of Object.entries(petsByRarity)) {
          const rarityInfo = RARITY_DATA[rarity]
          petMessage += ` ${rarityInfo.emoji} ${count} ${rarity},`
        }

        sendGlobalChatMessage('🐾', petMessage.slice(0, -1)) // Remove trailing comma
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
          sendTargetedChat('❌', `You don't have enough coins. Current balance: ${senderCoins}`, [
            event.entityId,
          ])
          sendTargetedNotification(
            '❌',
            `You don't have enough coins. Current balance: ${senderCoins}`,
            [event.entityId]
          )
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
      } else if (command === '/stats') {
        // Show coins, pets, playtime
        const playerData = getPlayerData(event.entityId)
        if (!playerData) continue
        const coins = playerData.coins
        const pets = playerData.pets
        const eggs = playerData.eggs
        const playtime = (Date.now() - playerData.joinDate) / 1000
        const playtimeString = `${Math.floor(playtime / 3600)}h ${Math.floor(
          (playtime % 3600) / 60
        )}m`

        // Count legendary pets
        const legendaryPets = pets.filter((pet) => pet.rarity === 'legendary').length
        const legendaryString = legendaryPets > 0 ? ` | 🌟 ${legendaryPets} legendary` : ''

        // Display all stats in a single message
        sendGlobalChatMessage(
          '📊',
          `${playerData.name} stats: 💰 ${coins} coins | 🥚 ${eggs} eggs | 🐾 ${pets.length} pets${legendaryString} | ⏱️ ${playtimeString}`
        )
      }
    }
  }

  /**
   * Periodic help message
   */
  if (helpMessageTimer >= HELP_MESSAGE_INTERVAL) {
    sendGlobalChatMessage(
      '🤖',
      'Available commands: /help, /coins, /eggs, /pets, /give <player name> <amount>, /stats'
    )
    helpMessageTimer = 0
  } else {
    helpMessageTimer += dt / 1000
  }

  /**
   * Occasional random global events to build excitement
   * About once every 5 minutes on average
   */
  if (Math.random() < 0.0005 * (dt / 1000)) {
    const events = [
      { message: '🌟 Lucky Star event! Everyone gets an egg!', action: 'egg' },
      { message: '💰 Money Rain! Everyone gets 100 coins!', action: 'coins' },
      { message: '🍀 Lucky Clover event! Double coins for the next minute!', action: 'none' },
    ]

    const randomEvent = events[Math.floor(Math.random() * events.length)]
    sendGlobalNotification('✨ EVENT', randomEvent.message)
    sendGlobalChatMessage('✨ EVENT', randomEvent.message)

    // Apply the event effect to all online players
    if (randomEvent.action === 'egg') {
      Array.from(playerData.keys()).forEach((id) => {
        addPlayerEgg(id, 1)
        sendTargetedChat('🎁', `You received a mystery egg!`, [id])
      })
    } else if (randomEvent.action === 'coins') {
      Array.from(playerData.keys()).forEach((id) => {
        addPlayerCoins(id, 100)
        sendTargetedChat('💰', `You received 100 coins!`, [id])
      })
    }
  }
}
