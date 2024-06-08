import * as THREE from 'three'
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { Sky } from 'three/examples/jsm/objects/Sky.js'
import { LoadManager } from './LoadManager'
import { Camera } from './camera'

import { PositionComponent } from '@shared/component/PositionComponent'
import { Entity } from '@shared/entity/Entity'
import { InputMessage } from '@shared/network/client/input'
import { EntityManager } from '@shared/system/EntityManager'
import { CSS2DRenderer } from 'three/addons/renderers/CSS2DRenderer.js'
import { FollowComponent } from './ecs/component/FollowComponent'
import { MutableRefObject } from 'react'

export interface Renderable {
  mesh: THREE.Mesh
  addToScene(): any
}
export class Renderer extends THREE.WebGLRenderer {
  camera: Camera
  scene: THREE.Scene
  css2DRenderer: CSS2DRenderer
  private directionalLight: THREE.DirectionalLight | undefined
  constructor(public gameContainerRef: MutableRefObject<any>) {
    super({ antialias: false, stencil: false, powerPreference: 'high-performance' })

    this.camera = new Camera(this)

    this.scene = new THREE.Scene()

    this.shadowMap.enabled = true
    this.shadowMap.type = THREE.PCFSoftShadowMap //THREE.BasicShadowMap | THREE.PCFShadowMap |  THREE.VSMShadowMap | THREE.PCFSoftShadowMap

    this.setSize(window.innerWidth, window.innerHeight)
    this.setPixelRatio(window.devicePixelRatio)
    this.toneMapping = THREE.CineonToneMapping
    this.toneMappingExposure = 0.8
    this.css2DRenderer = new CSS2DRenderer()
    this.css2DRenderer.setSize(window.innerWidth, window.innerHeight)
    this.css2DRenderer.domElement.style.position = 'absolute'
    this.css2DRenderer.domElement.style.top = '0'
    this.css2DRenderer.domElement.style.pointerEvents = 'none'

    // Prevent right click context menu
    this.domElement.addEventListener('contextmenu', (event) => event.preventDefault())
    this.addLight()
    this.addDirectionnalLight()
    this.addSky()
    window.addEventListener('resize', this.onWindowResize.bind(this), false)
  }

  appendChild() {
    console.log(this.gameContainerRef)
    this.gameContainerRef.current.appendChild(this.domElement)
    if (this.css2DRenderer) document.body.appendChild(this.css2DRenderer.domElement)
    else console.error("Can't append child CSS3DRenderer")
  }
  private addSky() {
    const sun = new THREE.Vector3()

    let sky = new Sky()

    const uniforms = sky.material.uniforms
    uniforms['turbidity'].value = 1
    uniforms['rayleigh'].value = 0.3
    uniforms['mieCoefficient'].value = 0.025
    uniforms['mieDirectionalG'].value = 0.7

    const elevation = 2
    const azimuth = 180

    const phi = THREE.MathUtils.degToRad(90 - elevation)
    const theta = THREE.MathUtils.degToRad(azimuth)

    sun.setFromSphericalCoords(1, phi, theta)

    uniforms['sunPosition'].value.copy(sun)

    sky.scale.setScalar(450000)
    this.scene.add(sky)
  }
  private addDirectionnalLight() {
    // Create a directional light for shadows and highlights
    // Create a directional light with a different color and intensity
    this.directionalLight = new THREE.DirectionalLight(0xffffff, 1.5)
    this.directionalLight.position.set(100, 100, 100)

    // Configure shadow properties with different values
    this.directionalLight.shadow.mapSize.height = 2048
    this.directionalLight.shadow.mapSize.width = 2048
    const shadowSideLength = 75
    this.directionalLight.shadow.camera.top = shadowSideLength
    this.directionalLight.shadow.camera.bottom = -shadowSideLength
    this.directionalLight.shadow.camera.left = -shadowSideLength
    this.directionalLight.shadow.camera.right = shadowSideLength
    this.directionalLight.shadow.camera.near = 0.5
    this.directionalLight.shadow.camera.far = 500
    this.directionalLight.shadow.normalBias = 0.06
    // Enable shadow casting
    this.directionalLight.castShadow = true

    // Create a target for the directional light
    const lightTarget = new THREE.Object3D()
    this.directionalLight.target = lightTarget

    // Add the directional light and its target to the scene
    this.scene.add(this.directionalLight, lightTarget)

    // Uncomment the following lines to add a helper for visualization
    // const helper = new THREE.DirectionalLightHelper(this.directionalLight, 10)
    // this.scene.add(helper)
  }

  private addLight() {
    // Use HemisphereLight for natural lighting
    const hemiLight = new THREE.HemisphereLight(0xc0fafc, 0x9563ff, 1)
    hemiLight.color.setHSL(0.59, 0.4, 0.6)
    hemiLight.groundColor.setHSL(0.095, 0.2, 0.75)
    hemiLight.position.set(0, 50, 0)
    this.scene.add(hemiLight)
  }

  update(deltaTime: number, entities: Entity[], inputMessage: InputMessage) {
    const followedEntity = EntityManager.getFirstEntityWithComponent(entities, FollowComponent)
    if (followedEntity && this.directionalLight) {
      const position = followedEntity.getComponent(PositionComponent)
      if (position) {
        this.directionalLight.position.lerp(
          new THREE.Vector3(position.x, position.y + 150, position.z - 15),
          0.1
        )
        this.directionalLight.target.position.lerp(
          new THREE.Vector3(position.x, position.y, position.z),
          0.1
        )
      }
    }
    this.camera.update(deltaTime, entities, inputMessage)
    this.css2DRenderer.render(this.scene, this.camera)
    this.render(this.scene, this.camera)
  }

  private onWindowResize() {
    if (!this.camera) return
    this.camera.aspect = window.innerWidth / window.innerHeight
    this.camera.updateProjectionMatrix()
    this.setSize(window.innerWidth, window.innerHeight)
    this.css2DRenderer.setSize(window.innerWidth, window.innerHeight)
  }
}
