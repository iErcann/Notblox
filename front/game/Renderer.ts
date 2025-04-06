import * as THREE from 'three'
import { Camera } from './Camera'

import { PositionComponent } from '@shared/component/PositionComponent'
import { Entity } from '@shared/entity/Entity'
import { InputMessage } from '@shared/network/client/inputMessage'
import { EntityManager } from '@shared/system/EntityManager'
import { CSS2DRenderer } from 'three/addons/renderers/CSS2DRenderer.js'
import { FollowComponent } from './ecs/component/FollowComponent'
import { MutableRefObject } from 'react'

import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js'
import { GammaCorrectionShader } from 'three/examples/jsm/shaders/GammaCorrectionShader.js'

export class Renderer extends THREE.WebGLRenderer {
  camera: Camera
  scene: THREE.Scene
  css2DRenderer: CSS2DRenderer
  composer?: EffectComposer

  private directionalLight: THREE.DirectionalLight | undefined
  constructor(public gameContainerRef: MutableRefObject<any>) {
    super({ antialias: true, stencil: false, powerPreference: 'high-performance' })
    // Disable auto update of shadow map, expensive operation
    this.camera = new Camera(this)

    this.scene = new THREE.Scene()
    this.shadowMap.enabled = true
    this.shadowMap.type = THREE.PCFSoftShadowMap

    this.setSize(window.innerWidth, window.innerHeight)
    this.setPixelRatio(this.getDevicePixelRatio())

    this.css2DRenderer = new CSS2DRenderer()
    this.css2DRenderer.setSize(window.innerWidth, window.innerHeight)
    this.css2DRenderer.domElement.style.position = 'absolute'
    this.css2DRenderer.domElement.style.top = '0'
    this.css2DRenderer.domElement.style.pointerEvents = 'none'

    // Prevent right click context menu
    this.domElement.addEventListener('contextmenu', (event) => event.preventDefault())
    this.addStaticLight()
    this.addDirectionnalLight()
    this.addHDRSky()
    // this.setupPostProcessing()

    window.addEventListener('resize', this.onWindowResize.bind(this), false)
  }

  private getDevicePixelRatio(): number {
    const userAgent = window.navigator.userAgent.toLowerCase()
    const isMobile = /iphone|ipad|ipod|android|blackberry|mini|windows\sce|palm/i.test(userAgent)
    return isMobile ? window.devicePixelRatio / 2 : window.devicePixelRatio / 1.2
  }

  private setupPostProcessing() {
    this.toneMapping = THREE.ACESFilmicToneMapping
    this.toneMappingExposure = 0.4
    // Create EffectComposer
    this.composer = new EffectComposer(this)
    this.composer.setSize(window.innerWidth, window.innerHeight)

    // Add RenderPass
    const renderPass = new RenderPass(this.scene, this.camera)
    this.composer.addPass(renderPass)

    // Add UnrealBloomPass
    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      0.5,
      0.1,
      0.9
    )
    this.composer.addPass(bloomPass)

    // Add GammaCorrectionPass
    const gammaCorrectionPass = new ShaderPass(GammaCorrectionShader)
    this.composer.addPass(gammaCorrectionPass)
  }

  appendChild() {
    console.log(this.gameContainerRef)
    this.gameContainerRef.current.appendChild(this.domElement)
    if (this.css2DRenderer) document.body.appendChild(this.css2DRenderer.domElement)
    else console.error("Can't append child CSS3DRenderer")

    // Add ocean after appending renderer
    //this.addOcean()
  }

  private addHDRSky() {
    // Environment map
    const textureLoader = new THREE.TextureLoader()
    // Load a sky texture for the environment map
    // Options: kloofendal_48d_partly_cloudy_puresky, rustig_koppie_puresky
    const texture = textureLoader.load('/sky/kloofendal_48d_partly_cloudy_puresky.webp')
    texture.mapping = THREE.EquirectangularReflectionMapping

    this.scene.background = texture
    this.scene.environment = texture
  }
  private addDirectionnalLight() {
    // Check the markdown "PERFORMANCE.md" inside this repo for more information
    // Create a directional light for shadows and highlights
    this.directionalLight = new THREE.DirectionalLight(0xff8a0d, 2)
    this.directionalLight.position.set(100, 100, -250)

    // Configure shadow properties with different values
    // Set the resolution of the shadow map texture (higher = sharper shadows but more expensive)
    this.directionalLight.shadow.mapSize.height = 2048
    this.directionalLight.shadow.mapSize.width = 2048

    // Define the size of the orthographic camera's view frustum used for shadow mapping
    const shadowSideLength = 150 // Controls how large an area will receive shadows

    // Set the boundaries of the orthographic camera's view frustum
    // These define a square area centered on the light's target where shadows will be cast
    this.directionalLight.shadow.camera.top = shadowSideLength // Upper boundary
    this.directionalLight.shadow.camera.bottom = -shadowSideLength // Lower boundary
    this.directionalLight.shadow.camera.left = -shadowSideLength // Left boundary
    this.directionalLight.shadow.camera.right = shadowSideLength // Right boundary
    this.directionalLight.shadow.camera.near = 0.01
    this.directionalLight.shadow.camera.far = 500

    // Improve shadow quality
    this.directionalLight.shadow.bias = -0.0001
    this.directionalLight.shadow.normalBias = 0.02
    this.directionalLight.shadow.radius = 1.5

    // Enable shadow casting
    this.directionalLight.castShadow = true

    // Create a target for the directional light
    const lightTarget = new THREE.Object3D()
    this.directionalLight.target = lightTarget
    this.scene.add(this.directionalLight, lightTarget)
  }

  private addStaticLight() {
    // Use HemisphereLight for natural lighting
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0xff8a05, 1)
    hemiLight.position.set(0, 50, 0)
    this.scene.add(hemiLight)
  }

  update(deltaTime: number, entities: Entity[], inputMessage: InputMessage) {
    const followedEntity = EntityManager.getFirstEntityWithComponent(entities, FollowComponent)
    if (followedEntity && this.directionalLight) {
      const position = followedEntity.getComponent(PositionComponent)
      if (position) {
        this.directionalLight.position.lerp(
          new THREE.Vector3(position.x, position.y + 150, position.z + 150),
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
    if (this.composer) {
      this.composer.render(deltaTime) // Use composer instead of direct rendering
    }
  }

  private onWindowResize() {
    if (!this.camera) return
    this.camera.aspect = window.innerWidth / window.innerHeight
    this.camera.updateProjectionMatrix()
    this.setSize(window.innerWidth, window.innerHeight)
    this.css2DRenderer.setSize(window.innerWidth, window.innerHeight)
    if (this.composer) {
      this.composer.setSize(window.innerWidth, window.innerHeight)
    }
  }
}
