import Rapier from "../../../physics/rapier.js";
import { Entity } from "../../../../../shared/entity/Entity.js";
import { EventTrimeshComponent } from "../../component/events/EventTrimeshComponent.js";
import {
  DRACOLoader,
  GLTF,
  GLTFLoader,
  loadGltf,
  TextureLoader,
} from "node-three-gltf";
import THREE from "three";

export class TrimeshSystem {
  private gltfLoader: GLTFLoader;

  constructor() {
    // Configure I/O.
    this.gltfLoader = new GLTFLoader();
  }

  async loadGLTFModel(url: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.gltfLoader.load(
        url,
        (gltf) => {
          resolve(gltf); // Resolve the promise when loading is successful
        },
        undefined, // onProgress callback (you can add one if needed)
        (error) => {
          reject(error); // Reject the promise on error
        }
      );
    });
  }

  async update(entities: Entity[], world: Rapier.World) {
    for (const entity of entities) {
      const eventTrimeshComponent = entity.getComponent(EventTrimeshComponent);
      if (eventTrimeshComponent) {
        console.log(entity.id, "geometry");

        try {
          this.loadGLTFModel(
            "https://myaudio.nyc3.cdn.digitaloceanspaces.com/SimpleWorld.glb"
          ).then((gltf: GLTF) => {
            if (gltf) {
              // Add the mesh to your scene
              // Optionally, you can access the mesh's geometry, vertices, and indices

              const mesh = gltf.scene.children[0] as THREE.Mesh;
              const indices = mesh.geometry.index?.array;
              const vertices = mesh.geometry.attributes.position.array;

              // const geometry = new THREE.BufferGeometry();
              // geometry.setAttribute(
              //   "position",
              //   new THREE.BufferAttribute(new Float32Array(vertices), 3)
              // );

              console.log(indices, vertices);
              // Create a new Float32Array to hold the scaled vertices
              const scaledVertices = new Float32Array(vertices.length);

              // Scale the vertices
              for (let i = 0; i < vertices.length; i++) {
                scaledVertices[i] = vertices[i] * 1;
              }

              // Use the scaledVertices array in your trimesh creation

              console.log(vertices, indices);
              const trimeshDesc = Rapier.ColliderDesc.trimesh(
                scaledVertices as Float32Array,
                indices as Uint32Array
              );

              console.log(indices, vertices);

              const rigidBody = Rapier.RigidBodyDesc.kinematicPositionBased();

              world.createCollider(
                trimeshDesc,
                world.createRigidBody(rigidBody)
              );
            }
          });
        } catch (error) {
          console.error("Error loading GLTF model:", error);
        }
        entity.removeComponent(EventTrimeshComponent);
      }
    }
  }
}
