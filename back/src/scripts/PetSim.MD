# Notblox Pet Simulator Documentation

## Game Overview

The Pet Simulator is a game where players collect coins by jumping in play areas, buy or find eggs, and hatch pets that provide passive income bonuses. The game features a rarity system, pet leveling mechanics, random rewards, and social interactions to create engagement loops.

## Core Mechanics

### Pet System

Pets are the main collectible items that provide passive income to players.

#### Pet Types and Rarities

| Pet Name    | Rarity    | Base Bonus | Size | Description                 |
| ----------- | --------- | ---------- | ---- | --------------------------- |
| Cat         | Common    | 2 coins    | 1.0  | Basic companion             |
| Chick       | Common    | 1 coin     | 1.0  | Smallest pet                |
| Chicken     | Common    | 3 coins    | 1.0  | Basic farm pet              |
| Dog         | Uncommon  | 5 coins    | 1.0  | Medium rarity companion     |
| Pig         | Uncommon  | 4 coins    | 1.0  | Medium rarity farm animal   |
| Sheep       | Uncommon  | 6 coins    | 1.0  | Better uncommon pet         |
| Horse       | Rare      | 10 coins   | 1.0  | High-value rare pet         |
| Raccoon     | Rare      | 8 coins    | 1.0  | Smaller rare pet            |
| Wolf        | Epic      | 15 coins   | 1.0  | High-tier powerful pet      |
| Golden Wolf | Legendary | 30 coins   | 2.0  | Top-tier pet with max bonus |

#### Rarity System

| Rarity    | Base Chance | Color   | Emoji Symbol |
| --------- | ----------- | ------- | ------------ |
| Common    | 60%         | #AAAAAA | ⚪           |
| Uncommon  | 25%         | #55AA55 | 🟢           |
| Rare      | 10%         | #5555FF | 🔵           |
| Epic      | 4%          | #AA00AA | 🟣           |
| Legendary | 1%          | #FFAA00 | 🟠           |

### Egg System

Eggs are the primary method for obtaining pets. Players can find eggs randomly while playing or purchase them from shops.

#### Egg Types

| Egg Type    | Price | Description                          | Symbol | Special Modifiers                                                     |
| ----------- | ----- | ------------------------------------ | ------ | --------------------------------------------------------------------- |
| Basic Egg   | 100   | Contains mostly common pets          | 🥚     | Common: 1.2x, Uncommon: 0.9x, Rare: 0.8x, Epic: 0.5x, Legendary: 0.2x |
| Spotted Egg | 350   | Higher chance for uncommon and rare  | 🥚🟢   | Common: 0.5x, Uncommon: 1.5x, Rare: 1.2x, Epic: 0.8x, Legendary: 0.5x |
| Golden Egg  | 1000  | Much higher chance for rare and epic | 🥚✨   | Common: 0.2x, Uncommon: 0.8x, Rare: 1.5x, Epic: 1.5x, Legendary: 1.0x |
| Crystal Egg | 2500  | High chance for epic and legendary   | 🥚💎   | Common: 0.1x, Uncommon: 0.3x, Rare: 0.7x, Epic: 2.0x, Legendary: 3.0x |

### Pet Leveling System

When a player hatches a duplicate pet, instead of getting another copy, the existing pet gains a level (up to level 10).

#### Level Multipliers

| Level | Multiplier | Bonus Increase |
| ----- | ---------- | -------------- |
| 1     | 1.0x       | Base           |
| 2     | 1.5x       | +50%           |
| 3     | 2.0x       | +100%          |
| 4     | 3.0x       | +200%          |
| 5     | 4.0x       | +300%          |
| 6     | 6.0x       | +500%          |
| 7     | 8.0x       | +700%          |
| 8     | 12.0x      | +1100%         |
| 9     | 18.0x      | +1700%         |
| 10    | 25.0x      | +2400%         |

When a pet reaches max level (10) and a player hatches another duplicate, they receive 500 bonus coins instead.

#### Pet Growth Mechanics

As pets level up, they also grow slightly in size:

- Each level increases pet size by 5% (growth factor of 0.05 per level)
- The formula is: `finalSize = baseSize * (1 + (level - 1) * 0.05)`
- Visual representation changes in real-time when levels increase

### Random Rewards System

While playing, players have a 15% chance to receive a bonus reward every time they collect coins by jumping.

#### Reward Types and Probabilities

| Reward Type | Amount      | Chance | Description              |
| ----------- | ----------- | ------ | ------------------------ |
| Coins       | 10          | 30%    | Small coin stash         |
| Coins       | 50          | 10%    | Medium coin stash        |
| Coins       | 200         | 2%     | Large coin stash         |
| Coins       | 1000        | 1%     | JACKPOT! Huge coin stash |
| Egg         | 1 Basic Egg | 1%     | Mystery egg              |

### Game Events

The game includes random global events that occur approximately once every 5 minutes (0.05% chance per second).

#### Event Types

| Event Name   | Effect                    | Probability |
| ------------ | ------------------------- | ----------- |
| Lucky Star   | Everyone gets an egg      | 33.3%       |
| Money Rain   | Everyone gets 100 coins   | 33.3%       |
| Lucky Clover | Double coins announcement | 33.3%       |

## Social Features

### Legendary Pet Announcements

When a player hatches a legendary pet:

- Global announcement to all players
- Everyone receives 50 bonus coins
- Special notifications with emoji flair

### Pet Level-Up Announcements

When a pet reaches level 8 or higher, a global announcement is made to showcase the achievement.

### Leaderboard System

- Displays top players by coin count
- Shows total pet count for each player
- Adds a special badge (⭐) for players with legendary pets

## Game Loop and Engagement Mechanics

1. **Collection Loop**: Players are motivated to collect all pets, especially rare ones
2. **Progression Loop**: Players level up pets to increase their coin generation
3. **Random Reward Loop**: Unpredictable rewards create dopamine hits
4. **Social Status Loop**: Public recognition for rare finds and high-level pets
5. **Economy Loop**: Coins → Eggs → Pets → More Coins

## Player Onboarding

- New players receive a welcome message with instructions
- First-time players get a free egg
- Reconnecting players have their pets automatically respawned
- Periodic help messages remind players of available commands
- For testing purposes, new players start with 10,000,000 coins (adjustable for production)

## Game World Layout

- **Egg Shops**: Four shops
  - Each shop has a max interaction distance of 10 units
- **Egg Hatching Station**: Located at x: -0.027, y: -15.877, z: 80.238
  - Has a max interaction distance of 30 units for easier access
- **Jumping/Coin Area**: Large trigger area where players earn coins

## Commands

- `/help` - Shows available commands
- `/coins` - Displays current coin balance
- `/eggs` - Shows current egg count
- `/pets` - Lists pets by rarity
- `/give <player> <amount>` - Gives coins to another player
- `/stats` - Displays comprehensive player statistics

## Technical Implementation

The game leverages an Entity Component System (ECS) architecture with networked components for multiplayer functionality. Pets are implemented as orbital companions that follow players.

### Pet Update Mechanism

- When a pet levels up, the system attempts to update the existing entity rather than destroying and recreating it
- Updates include changing the pet's text label to show its new level
- Size components are updated in real-time based on level

### Player Data Persistence

- Player data is stored in memory during the game session
- Includes coins, pets inventory, egg inventory, and other statistics
- Data is maintained until player disconnects
