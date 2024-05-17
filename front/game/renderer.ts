import * as THREE from 'three'
import { Camera } from './camera'
import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { LoadManager } from './LoadManager'
import { Sky } from 'three/examples/jsm/objects/Sky.js'

import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js'
import { GlitchPass } from 'three/addons/postprocessing/GlitchPass.js'
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js'
import { CSS2DRenderer } from 'three/addons/renderers/CSS2DRenderer.js'
import { Entity } from '@shared/entity/Entity'
import { EntityManager } from '@shared/entity/EntityManager'
import { FollowComponent } from './ecs/component/FollowComponent'
import { PositionComponent } from '@shared/component/PositionComponent'

export interface Renderable {
  mesh: THREE.Mesh
  addToScene(): any
}
export class Renderer extends THREE.WebGLRenderer {
  public camera: Camera
  public scene: THREE.Scene
  public css2DRenderer: CSS2DRenderer
  private directionalLight: THREE.DirectionalLight | undefined
  constructor(scene: THREE.Scene, loadManager: LoadManager) {
    super({ antialias: true })

    this.camera = new Camera(this)

    this.scene = scene

    this.shadowMap.enabled = true
    this.shadowMap.type = THREE.PCFSoftShadowMap //THREE.BasicShadowMap | THREE.PCFShadowMap |  THREE.VSMShadowMap | THREE.PCFSoftShadowMap

    this.setSize(window.innerWidth, window.innerHeight)
    this.setPixelRatio(window.devicePixelRatio)
    this.toneMapping = THREE.CineonToneMapping
    // this.toneMappingExposure = 0.5;

    this.css2DRenderer = new CSS2DRenderer()
    this.css2DRenderer.setSize(window.innerWidth, window.innerHeight)
    this.css2DRenderer.domElement.style.position = 'absolute'
    this.css2DRenderer.domElement.style.top = '0'
    this.css2DRenderer.domElement.style.pointerEvents = 'none'

    this.addLight()
    this.addDirectionnalLight()
    this.addWorld(loadManager)
    this.addSky()
    // this.addGround();
    // Use arrow function to ensure 'this' refers to the class instance
    window.addEventListener('resize', this.onWindowResize.bind(this), false)
  }

  public appendChild() {
    document.body.appendChild(this.domElement)
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

    // Configure shadow properties with different values
    this.directionalLight.shadow.mapSize.height = 1024
    const shadowSideLength = 75
    this.directionalLight.shadow.camera.top = shadowSideLength
    this.directionalLight.shadow.camera.bottom = -shadowSideLength
    this.directionalLight.shadow.camera.left = -shadowSideLength
    this.directionalLight.shadow.camera.right = shadowSideLength
    this.directionalLight.shadow.normalBias = 0.06
    // Enable shadow casting
    this.directionalLight.castShadow = true

    // Create a target for the directional light
    const lightTarget = new THREE.Object3D()
    this.directionalLight.target = lightTarget

    // Add the directional light and its target to the scene
    this.scene.add(this.directionalLight, lightTarget)

    // Uncomment the following lines to add a helper for visualization
    const helper = new THREE.DirectionalLightHelper(this.directionalLight, 10)
    this.scene.add(helper)
  }

  private addLight() {
    // Use HemisphereLight for natural lighting
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 1)
    hemiLight.color.setHSL(0.59, 0.4, 0.6)
    hemiLight.groundColor.setHSL(0.095, 0.2, 0.75)
    hemiLight.position.set(0, 50, 0)
    this.scene.add(hemiLight)
  }

  private addGround() {
    // Create a simple colored ground
    const groundMaterial = new THREE.MeshPhongMaterial({
      color: 0xbdbdbd, // Adjust the color as needed (green in this case)
    })

    const groundGeometry = new THREE.PlaneGeometry(1000, 1000)
    const groundMesh = new THREE.Mesh(groundGeometry, groundMaterial)
    groundMesh.receiveShadow = true
    groundMesh.castShadow = true
    groundMesh.rotation.x = -Math.PI / 2

    this.scene.add(groundMesh)
  }

  private addWorld(loadManager: LoadManager) {
    loadManager
      // .glTFLoad("https://myaudio.nyc3.cdn.digitaloceanspaces.com/world_1-1.glb")
      .glTFLoad('assets/small.glb')
      .then((gtlf: GLTF) => {
        this.scene.add(gtlf.scene)
        gtlf.scene.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.castShadow = true // Make the child mesh cast shadows
            child.receiveShadow = true // Make the child mesh receive shadows
          }
        })
      })
  }
  public update(entities: Entity[]) {
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
    this.camera.update()
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
