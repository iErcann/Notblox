import { Entity } from "../../../../../shared/entity/Entity.js";
import { GLTF, GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { EventTrimeshComponent } from "../../component/events/EventTrimeshComponent.js";

export class TrimeshSystem {
  private gltfLoader: GLTFLoader;

  constructor() {
    this.gltfLoader = new GLTFLoader();
  }

  async loadGLTFModel(url: string): Promise<GLTF> {
    // https://github.com/donmccurdy/glTF-Transform
    return new Promise((resolve, reject) => {
      this.gltfLoader.load(
        url,
        (gtlf: GLTF) => {
          resolve(gtlf);
        },
        undefined,
        (error: any) => {
          reject(error);
        }
      );
    });
  }

  async update(entities: Entity[]) {
    for (const entity of entities) {
      const eventTrimeshComponent = entity.getComponent(EventTrimeshComponent);
      if (eventTrimeshComponent) {
        try {
          const gltf = await this.loadGLTFModel(
            "https://myaudio.nyc3.cdn.digitaloceanspaces.com/SimpleWorld.glb"
          );
          console.log(gltf);
        } catch (error) {
          console.error("Error loading GLTF model:", error);
        }

        entity.removeComponent(EventTrimeshComponent);
      }
    }
  }
}
