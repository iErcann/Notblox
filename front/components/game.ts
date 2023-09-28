import * as THREE from "three";
import { Camera } from "./camera";
import { Renderer } from "./renderer";

export class Game {
  lastRenderTime = Date.now();
  tickrate = 20;
  renderer: Renderer;
  loopFunction: () => void = this.loop.bind(this);

  constructor() {
    const camera = new Camera();
    this.renderer = new Renderer(camera, new THREE.Scene());
  }

  loop() {
    const now = Date.now();
    console.log("Loop");
    this.renderer.update();
    this.lastRenderTime = now;
  }

  start() {
    document.body.appendChild(this.renderer.domElement);
    this.renderer.setAnimationLoop(this.loopFunction);
  }
}
