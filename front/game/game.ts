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
import { ServerMeshSystem } from './ecs/system/ServerMeshSystem'
import { IdentifyFollowedMeshSystem } from './ecs/system/IdentifyFollowedMeshSystem'
import { MutableRefObject } from 'react'
import { TransformControlsSystem, TransformControlsMode } from './ecs/system/TransformControlsSystem'
import { Player } from './ecs/entity/Player'

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
  renderer: Renderer
  hud: Hud
  private identifyFollowedMeshSystem: IdentifyFollowedMeshSystem
  private transformControlsSystem: TransformControlsSystem
  private systems: XRSystem[] = []

  private players: Map<number, Player> = new Map()

  private constructor(gameContainerRef: MutableRefObject<any>, port?: number) {
    // Initialize WebSocketManager first
    this.websocketManager = new WebSocketManager(this, port)

    // Then initialize Renderer with the websocketManager
    this.renderer = new Renderer(gameContainerRef, this.websocketManager)

    // Rest of the initializations
    this.syncComponentSystem = new SyncComponentsSystem(this)
    this.syncPositionSystem = new SyncPositionSystem()
    this.syncRotationSystem = new SyncRotationSystem()
    this.syncColorSystem = new SyncColorSystem()
    this.syncSizeSystem = new SyncSizeSystem()
    this.animationSystem = new AnimationSystem()
    this.sleepCheckSystem = new SleepCheckSystem()
    this.chatSystem = new ChatSystem()
    this.destroySystem = new DestroySystem()
    this.meshSystem = new MeshSystem()
    this.serverMeshSystem = new ServerMeshSystem()
    this.identifyFollowedMeshSystem = new IdentifyFollowedMeshSystem()
    this.transformControlsSystem = new TransformControlsSystem(this.renderer, this.websocketManager)
    this.eventSystem = EventSystem.getInstance()

    this.inputManager = new InputManager(this.websocketManager, this.renderer.camera.controlSystem)
    this.hud = new Hud()

    this.initializeSystems()
  }

  private initializeSystems() {
    // Initialize other systems if needed
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

    this.inputManager.update()
    this.inputManager.sendInput()
    this.destroySystem.update(entities, this.renderer)
    this.meshSystem.update(entities, this.renderer)
    const deltaTime = now - this.lastRenderTime
    const positionInterpFactor = deltaTime / (1000 / config.SERVER_TICKRATE)
    this.syncPositionSystem.update(entities, positionInterpFactor / 2)
    this.syncRotationSystem.update(entities, 0.7)
    this.syncColorSystem.update(entities)
    this.chatSystem.update(entities, this.hud)
    this.syncSizeSystem.update(entities)
    this.identifyFollowedMeshSystem.update(entities, this)
    this.animationSystem.update(deltaTime, entities)
    this.destroySystem.afterUpdate(entities)
    this.eventSystem.afterUpdate(entities)
    if (this.transformControlsSystem.isEnabled()) {
      this.transformControlsSystem.update(entities)
    }
    this.renderer.updateTransformControls(entities)
    this.renderer.update(deltaTime, entities, this.inputManager.inputState)
    this.sleepCheckSystem.update(entities)
    this.websocketManager.timeSinceLastServerUpdate += deltaTime
    this.lastRenderTime = now
  }

  toggleTransformControls() {
    this.transformControlsSystem.toggleControls()
  }

  setTransformControlsMode(mode: TransformControlsMode) {
    this.transformControlsSystem.setMode(mode);
  }

  handlePlayerDisconnection(playerId: number) {
    const player = this.players.get(playerId);
    if (player) {
      player.disconnect()
      this.players.delete(playerId)
      console.log(`Player ${playerId} removed from the game`);
    } else {
      console.log(`Player ${playerId} not found in the game`);
    }
  }

  addPlayer(playerId: number) {
    const newPlayer = new Player(playerId, this)
    this.players.set(playerId, newPlayer)
    return newPlayer
  }

  getPlayer(playerId: number): Player | undefined {
    return this.players.get(playerId)
  }
}