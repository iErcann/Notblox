import * as THREE from "three";
import { Camera } from "./camera";
import { EntityManager } from "@shared/entity/EntityManager";
import { SyncComponentsSystem } from "./ecs/system/SyncComponentsSystem";
import { SyncPositionSystem } from "./ecs/system/SyncPositionSystem";
import { SyncRotationSystem } from "./ecs/system/SyncRotationSystem";
import { Renderer } from "./renderer";
import { WebSocketManager } from "./WebsocketManager";
import { InputManager } from "./InputManager";
import { config } from "@shared/network/config";
import { SyncSizeSystem } from "./ecs/system/SyncSizeSystem";
import { CameraFollowSystem } from "./ecs/system/CameraFollowSystem";
import { LoadManager } from "./LoadManager";
import { AnimationSystem } from "./ecs/system/AnimationSystem";

export class Game {
  private static instance: Game;
  public entityManager = EntityManager.getInstance();
  private lastRenderTime = Date.now();
  private loopFunction: () => void = this.loop.bind(this);
  public renderer: Renderer;
  public syncComponentSystem: SyncComponentsSystem;
  private syncPositionSystem: SyncPositionSystem;
  private syncRotationSystem: SyncRotationSystem;
  private syncSizeSystem: SyncSizeSystem;
  private cameraFollowSystem: CameraFollowSystem;
  private websocketManager: WebSocketManager;
  private animationSystem: AnimationSystem;
  public loadManager: LoadManager;
  public currentPlayerId = 0;
  private inputManager: InputManager;

  private constructor() {
    this.syncComponentSystem = new SyncComponentsSystem(this);
    this.syncPositionSystem = new SyncPositionSystem();
    this.syncRotationSystem = new SyncRotationSystem();
    this.syncSizeSystem = new SyncSizeSystem();
    this.cameraFollowSystem = new CameraFollowSystem();
    this.websocketManager = new WebSocketManager(this);
    this.inputManager = new InputManager(this.websocketManager);
    this.animationSystem = new AnimationSystem();
    this.loadManager = new LoadManager();
    this.loadManager.dracoLoad("./SanAndreasDraco.glb");
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
    document.body.appendChild(this.renderer.domElement);
    this.renderer.setAnimationLoop(this.loopFunction);
  }

  private interpolationFactor = 0.1; // Adjust this factor for the desired interpolation speed
  private tickRate = config.TICKRATE; // The tick rate in ticks per second
  private lastTickTime = 0; // Track the time of the last tick

  private loop() {
    const entities = this.entityManager.getAllEntities();
    const now = Date.now();
    this.websocketManager.update();
    this.inputManager.sendInput();
    // Calculate the time since the last tick

    const deltaTime = now - this.lastRenderTime;

    const interpolationFactor =
      this.websocketManager.timeSinceLastServerUpdate / (1000 / this.tickRate);

    // Update position and rotation with interpolation
    this.syncPositionSystem.update(entities, 0.3);
    this.syncRotationSystem.update(entities, 0.5);
    this.syncSizeSystem.update(entities);
    this.cameraFollowSystem.update(deltaTime, entities);
    this.animationSystem.update(entities);

    this.renderer.update();
    this.lastRenderTime = now;
    this.websocketManager.timeSinceLastServerUpdate += deltaTime;
  }
}
