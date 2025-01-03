import { EntityManager } from '@shared/system/EntityManager'
import { config } from '@shared/network/config'
import { InputManager } from './InputManager'
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
  MeshSystem,
  ServerMeshSystem,
  IdentifyFollowedMeshSystem,
  TextComponentSystem,
} from './ecs/system'
import { Hud } from './hud'
import { Renderer } from './renderer'
import { EventSystem } from '@shared/system/EventSystem'
import { MutableRefObject } from 'react'

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
  inputManager: InputManager
  private meshSystem: MeshSystem
  private serverMeshSystem: ServerMeshSystem
  private textComponentSystem: TextComponentSystem
  renderer: Renderer
  hud: Hud
  private identifyFollowedMeshSystem: IdentifyFollowedMeshSystem
  private constructor(gameContainerRef: MutableRefObject<any>, port?: number) {
    this.syncComponentSystem = new SyncComponentsSystem(this)
    this.syncPositionSystem = new SyncPositionSystem()
    this.syncRotationSystem = new SyncRotationSystem()
    this.syncColorSystem = new SyncColorSystem()
    this.syncSizeSystem = new SyncSizeSystem()
    this.websocketManager = new WebSocketManager(this, port)
    this.animationSystem = new AnimationSystem()
    this.sleepCheckSystem = new SleepCheckSystem()
    this.chatSystem = new ChatSystem()
    this.destroySystem = new DestroySystem()
    this.meshSystem = new MeshSystem()
    this.serverMeshSystem = new ServerMeshSystem()
    this.identifyFollowedMeshSystem = new IdentifyFollowedMeshSystem()
    this.eventSystem = EventSystem.getInstance()
    this.textComponentSystem = new TextComponentSystem()

    this.renderer = new Renderer(gameContainerRef)
    this.inputManager = new InputManager(this.websocketManager, this.renderer.camera.controlSystem)
    this.hud = new Hud()
  }

  static getInstance(port?: number, gameContainerRef?: MutableRefObject<any>): Game {
    if (!Game.instance) {
      if (!gameContainerRef) {
        throw new Error('Game instance not initialized with gameContainerRef')
      }
      Game.instance = new Game(gameContainerRef, port)
    }
    return Game.instance
  }

  async start() {
    // Wait for the WebSocket connection to be established
    await this.websocketManager.connect()
    this.renderer.appendChild()
    this.renderer.setAnimationLoop(this.loopFunction)
  }

  private loadingPromise: Promise<void> | null = null

  private async loop() {
    const entities = EntityManager.getInstance().getAllEntities()
    const now = Date.now()
    this.syncComponentSystem.update(entities)

    // Server can send us ServerMeshComponents to load.
    // This await is necessary to wait for the loading to finish before updating the entities
    // This will also delay all the other event operations until the loading is finished
    if (!this.loadingPromise) {
      this.loadingPromise = this.serverMeshSystem.update(entities)
    }

    // Wait for the loading operation to finish
    await this.loadingPromise
    this.loadingPromise = null

    this.identifyFollowedMeshSystem.update(entities, this)
    this.inputManager.update()
    this.inputManager.sendInput(entities)
    this.destroySystem.update(entities, this.renderer)
    this.meshSystem.update(entities, this.renderer)
    const deltaTime = now - this.lastRenderTime
    const positionInterpFactor = deltaTime / (1000 / config.SERVER_TICKRATE)
    this.syncPositionSystem.update(entities, positionInterpFactor / 2)
    this.syncRotationSystem.update(entities, 0.7)
    this.syncColorSystem.update(entities)
    this.chatSystem.update(entities, this.hud)
    this.textComponentSystem.update(entities, deltaTime)
    this.syncSizeSystem.update(entities)
    this.animationSystem.update(deltaTime, entities)
    this.destroySystem.afterUpdate(entities)
    this.eventSystem.afterUpdate(entities)
    this.renderer.update(deltaTime, entities, this.inputManager.inputState)
    this.sleepCheckSystem.update(entities)
    this.websocketManager.timeSinceLastServerUpdate += deltaTime
    this.lastRenderTime = now
  }
}
