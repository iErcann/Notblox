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
import * as THREE from "three";

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
    // An array to store the promises for GLTF model loading
    const loadPromises: Promise<void>[] = [];

    for (const entity of entities) {
      const eventTrimeshComponent = entity.getComponent(EventTrimeshComponent);
      if (eventTrimeshComponent) {
        console.log(entity.id, "geometry");

        const loadPromise = this.loadGLTFModel(
          "https://myaudio.nyc3.cdn.digitaloceanspaces.com/ClearedSanAndreas.glb"
        )
          .then(async (gltf: GLTF) => {
            if (gltf) {
              // Iterate over all child objects in the GLTF scene
              gltf.scene.traverse((child) => {
                if (child instanceof THREE.Mesh) {
                  const mesh = child as THREE.Mesh;
                  const indices = mesh.geometry.index?.array;
                  const vertices = mesh.geometry.attributes.position.array;

                  // Scale factor for the vertices
                  const scale = 1; // Adjust as needed

                  // Create a new Float32Array to hold the scaled vertices
                  const scaledVertices = new Float32Array(vertices.length);

                  // Scale the vertices
                  for (let i = 0; i < vertices.length; i++) {
                    scaledVertices[i] = vertices[i] * scale;
                  }

                  // Create the trimesh collider for the current mesh
                  const trimeshDesc = Rapier.ColliderDesc.trimesh(
                    scaledVertices as Float32Array,
                    indices as Uint32Array
                  );
                  trimeshDesc.setTranslation(
                    mesh.position.x,
                    mesh.position.y,
                    mesh.position.z
                  );

                  // Create a kinematic position-based rigid body
                  const rigidBody =
                    Rapier.RigidBodyDesc.kinematicPositionBased();

                  // Create the collider and attach it to the rigid body
                  world.createCollider(
                    trimeshDesc,
                    world.createRigidBody(rigidBody)
                  );
                  console.log("Created trimesh");
                }
              });
            }
          })
          .catch((error) => {
            console.error("Error loading GLTF model:", error);
          });

        loadPromises.push(loadPromise);
        entity.removeComponent(EventTrimeshComponent);
      }
    }

    // Wait for all GLTF model loading and trimesh creation to complete
    await Promise.all(loadPromises);
  }
}
