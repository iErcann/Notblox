import { EntityManager } from '@shared/entity/EntityManager'
import { config } from '@shared/network/config'
import * as THREE from 'three'
import { InputManager } from './InputManager'
import { LoadManager } from './LoadManager'
import { WebSocketManager } from './WebsocketManager'
import {
  AnimationSystem,
  ChatSystem,
  ClientEventSystem,
  DestroySystem,
  SleepCheckSystem,
  SyncColorSystem,
  SyncComponentsSystem,
  SyncPositionSystem,
  SyncRotationSystem,
  SyncSizeSystem,
  TopCameraFollowSystem,
} from './ecs/system'
import { Hud } from './hud'
import { Renderer } from './renderer'
import { BaseEventSystem } from '@shared/system/EventSystem'

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
  private topCameraFollowSystem: TopCameraFollowSystem
  private eventSystem: ClientEventSystem
  websocketManager: WebSocketManager
  private animationSystem: AnimationSystem
  private sleepCheckSystem: SleepCheckSystem
  private destroySystem: DestroySystem
  private chatSystem: ChatSystem
  loadManager: LoadManager
  private inputManager: InputManager
  renderer: Renderer
  hud: Hud
  private constructor() {
    this.syncComponentSystem = new SyncComponentsSystem(this)
    this.syncPositionSystem = new SyncPositionSystem()
    this.syncRotationSystem = new SyncRotationSystem()
    this.syncColorSystem = new SyncColorSystem()
    this.syncSizeSystem = new SyncSizeSystem()
    this.topCameraFollowSystem = new TopCameraFollowSystem()
    this.websocketManager = new WebSocketManager(this)
    this.animationSystem = new AnimationSystem()
    this.loadManager = new LoadManager()
    this.sleepCheckSystem = new SleepCheckSystem()
    this.chatSystem = new ChatSystem()
    this.destroySystem = new DestroySystem()

    BaseEventSystem.setEventSystemConstructor(ClientEventSystem)
    this.eventSystem = BaseEventSystem.getInstance()

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
    const deltaTime = now - this.lastRenderTime
    // Interp factor is wrong here
    // const interpolationFactor =
    //   this.websocketManager.timeSinceLastServerUpdate / (1000 / this.tickRate);

    const positionInterpFactor = deltaTime / (1000 / config.SERVER_TICKRATE)
    this.syncPositionSystem.update(entities, positionInterpFactor)
    this.syncRotationSystem.update(entities, 0.5)
    this.chatSystem.update(entities, this.hud)
    this.syncColorSystem.update(entities)
    this.syncSizeSystem.update(entities)
    this.animationSystem.update(deltaTime, entities)
    this.destroySystem.update(entities, this.renderer)
    this.sleepCheckSystem.update(entities)
    this.renderer.update(deltaTime, entities, this.inputManager.inputState)
    this.eventSystem.afterUpdate(entities)
    this.lastRenderTime = now
    this.websocketManager.timeSinceLastServerUpdate += deltaTime
  }
}
