import * as THREE from "three";
import { EntityManager } from "@shared/entity/EntityManager";
import { WebSocketManager } from "./WebsocketManager";
import { InputManager } from "./InputManager";
import { config } from "@shared/network/config";
import { LoadManager } from "./LoadManager";
import { Renderer } from "./renderer";
import {
  SyncComponentsSystem,
  SyncPositionSystem,
  SyncRotationSystem,
  SyncColorSystem,
  SyncSizeSystem,
  CameraFollowSystem,
  AnimationSystem,
  DestroySystem,
} from "./ecs/system";
import { Camera } from "./camera";
import { SleepCheckSystem } from "./ecs/system/SleepCheckSystem";

export class Game {
  private static instance: Game;
  public entityManager = EntityManager.getInstance();
  private lastRenderTime = Date.now();
  private loopFunction: () => void = this.loop.bind(this);
  public syncComponentSystem: SyncComponentsSystem;
  public currentPlayerEntityId: number | undefined;
  private syncPositionSystem: SyncPositionSystem;
  private syncRotationSystem: SyncRotationSystem;
  private syncColorSystem: SyncColorSystem;
  private syncSizeSystem: SyncSizeSystem;
  private cameraFollowSystem: CameraFollowSystem;
  private websocketManager: WebSocketManager;
  private animationSystem: AnimationSystem;
  private sleepCheckSystem: SleepCheckSystem;
  private destroySystem: DestroySystem;
  public loadManager: LoadManager;
  private inputManager: InputManager;
  public renderer: Renderer;

  private constructor() {
    this.syncComponentSystem = new SyncComponentsSystem(this);
    this.syncPositionSystem = new SyncPositionSystem();
    this.syncRotationSystem = new SyncRotationSystem();
    this.syncColorSystem = new SyncColorSystem();
    this.syncSizeSystem = new SyncSizeSystem();
    this.cameraFollowSystem = new CameraFollowSystem();
    this.websocketManager = new WebSocketManager(this);
    this.inputManager = new InputManager(this.websocketManager);
    this.animationSystem = new AnimationSystem();
    this.loadManager = new LoadManager();
    this.sleepCheckSystem = new SleepCheckSystem();
    // this.loadManager.dracoLoad("./SanAndreasDraco.glb");
    this.destroySystem = new DestroySystem();
    this.renderer = new Renderer(new THREE.Scene(), this.loadManager);
  }

  public static getInstance(): Game {
    if (!Game.instance) {
      Game.instance = new Game();
    }
    return Game.instance;
  }

  public async start() {
    // Wait for the WebSocket connection to be established
    await this.websocketManager.connect();
    this.renderer.appendChild();
    this.renderer.setAnimationLoop(this.loopFunction);
  }

  private interpolationFactor = 0.1;
  private tickRate = config.TICKRATE;
  private lastTickTime = 0;

  private loop() {
    const entities = this.entityManager.getAllEntities();
    const now = Date.now();
    this.websocketManager.update();
    this.inputManager.sendInput();
    const deltaTime = now - this.lastRenderTime;
    // Interp factor is wrong here
    // const interpolationFactor =
    //   this.websocketManager.timeSinceLastServerUpdate / (1000 / this.tickRate);
    this.syncPositionSystem.update(entities, 0.2);
    this.syncRotationSystem.update(entities, 0.5);
    this.syncColorSystem.update(entities);
    this.syncSizeSystem.update(entities);
    this.cameraFollowSystem.update(
      deltaTime,
      entities,
      this.inputManager.inputState
    );
    this.animationSystem.update(deltaTime, entities);
    this.destroySystem.update(entities, this.entityManager, this.renderer);
    this.sleepCheckSystem.update(entities);
    this.renderer.update();
    this.lastRenderTime = now;
    this.websocketManager.timeSinceLastServerUpdate += deltaTime;
  }
}
