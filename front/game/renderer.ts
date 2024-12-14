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

import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js'
import { GammaCorrectionShader } from 'three/examples/jsm/shaders/GammaCorrectionShader.js'

export interface Renderable {
  mesh: THREE.Mesh
  addToScene(): any
}
export class Renderer extends THREE.WebGLRenderer {
  camera: Camera
  scene: THREE.Scene
  css2DRenderer: CSS2DRenderer
  composer?: EffectComposer

  private directionalLight: THREE.DirectionalLight | undefined
  constructor(public gameContainerRef: MutableRefObject<any>) {
    super({ antialias: false, stencil: false, powerPreference: 'high-performance' })

    this.camera = new Camera(this)

    this.scene = new THREE.Scene()

    this.shadowMap.enabled = true
    this.shadowMap.type = THREE.PCFSoftShadowMap //THREE.BasicShadowMap | THREE.PCFShadowMap |  THREE.VSMShadowMap | THREE.PCFSoftShadowMap

    this.setSize(window.innerWidth, window.innerHeight)
    this.setPixelRatio(this.getDevicePixelRatio())

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
  }
  private addSky() {
    const sun = new THREE.Vector3()

    let sky = new Sky()

    const uniforms = sky.material.uniforms
    uniforms['turbidity'].value = 12
    uniforms['rayleigh'].value = 0
    uniforms['mieCoefficient'].value = 0.045
    uniforms['mieDirectionalG'].value = 0.0263

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
    this.directionalLight = new THREE.DirectionalLight(0xff8a0d, 2)
    this.directionalLight.position.set(100, 100, -2500)

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
          new THREE.Vector3(position.x, position.y + 150, position.z - 150),
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
