import { EntityManager } from '@shared/system/EntityManager'
import { config } from '@shared/network/config'
import * as THREE from 'three'
import { InputManager } from './InputManager'
import { LoadManager } from './LoadManager'
import { WebSocketManager } from './WebsocketManager'
import {
  AnimationSystem,
  ChatSystem,
  DestroySystem,
  SleepCheckSystem,
  SyncColorSystem,
  SyncComponentsSystem,
  SyncPositionSystem,
  SyncRotationSystem,
  SyncSizeSystem,
} from './ecs/system'
import { Hud } from './hud'
import { Renderer } from './renderer'
import { EventSystem } from '@shared/system/EventSystem'
import { MeshSystem } from './ecs/system/MeshSystem'

export class Game {
  private static instance: Game
  entityManager = EntityManager
  currentPlayerEntityId: number | undefined
  private lastRenderTime = Date.now()
  private loopFunction: () => void = this.loop.bind(this)
  syncComponentSystem: SyncComponentsSystem
  private syncPositionSystem: SyncPositionSystem
  private syncRotationSystem: SyncRotationSystem
  private syncColorSystem: SyncColorSystem
  private syncSizeSystem: SyncSizeSystem
  private eventSystem: EventSystem
  websocketManager: WebSocketManager
  private animationSystem: AnimationSystem
  private sleepCheckSystem: SleepCheckSystem
  private destroySystem: DestroySystem
  private chatSystem: ChatSystem
  loadManager: LoadManager
  inputManager: InputManager
  private meshSystem: MeshSystem
  renderer: Renderer
  hud: Hud
  private constructor() {
    this.syncComponentSystem = new SyncComponentsSystem(this)
    this.syncPositionSystem = new SyncPositionSystem()
    this.syncRotationSystem = new SyncRotationSystem()
    this.syncColorSystem = new SyncColorSystem()
    this.syncSizeSystem = new SyncSizeSystem()
    this.websocketManager = new WebSocketManager(this)
    this.animationSystem = new AnimationSystem()
    this.loadManager = new LoadManager()
    this.sleepCheckSystem = new SleepCheckSystem()
    this.chatSystem = new ChatSystem()
    this.destroySystem = new DestroySystem()
    this.meshSystem = new MeshSystem()

    this.eventSystem = EventSystem.getInstance()

    this.renderer = new Renderer(new THREE.Scene(), this.loadManager)
    this.inputManager = new InputManager(this.websocketManager)
    this.hud = new Hud()
  }

  static getInstance(): Game {
    if (!Game.instance) {
      Game.instance = new Game()
    }
    return Game.instance
  }

  async start() {
    // Wait for the WebSocket connection to be established
    await this.websocketManager.connect()
    this.renderer.appendChild()
    this.renderer.setAnimationLoop(this.loopFunction)
  }

  private interpolationFactor = 0.1
  private lastTickTime = 0

  private loop() {
    const entities = EntityManager.getInstance().getAllEntities()
    const now = Date.now()
    this.inputManager.sendInput()
    this.syncComponentSystem.update(entities)
    this.destroySystem.update(entities, this.renderer)
    this.meshSystem.update(entities, this.renderer)
    const deltaTime = now - this.lastRenderTime
    // Interp factor is wrong here
    // const interpolationFactor =
    //   this.websocketManager.timeSinceLastServerUpdate / (1000 / this.tickRate);

    const positionInterpFactor = deltaTime / (1000 / config.SERVER_TICKRATE)
    this.syncPositionSystem.update(entities, positionInterpFactor)
    this.syncRotationSystem.update(entities, 0.5)
    this.syncColorSystem.update(entities)
    this.chatSystem.update(entities, this.hud)
    this.syncSizeSystem.update(entities)
    this.animationSystem.update(deltaTime, entities)
    this.eventSystem.afterUpdate(entities)
    this.renderer.update(deltaTime, entities, this.inputManager.inputState)
    this.sleepCheckSystem.update(entities)
    this.destroySystem.afterUpdate(entities)
    this.websocketManager.timeSinceLastServerUpdate += deltaTime
    this.lastRenderTime = now
  }
}
