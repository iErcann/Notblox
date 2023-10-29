import * as THREE from "three";
import { MeshComponent } from "../component/MeshComponent";

import { GLTF } from "three/examples/jsm/loaders/GLTFLoader.js";

import { Entity } from "@shared/entity/Entity";
import { SerializedEntityType } from "@shared/network/server/serialized";
import { Game } from "@/game/game";
import { FollowComponent } from "../component/FollowComponent";
import { AnimationComponent } from "../component/AnimationComponent";

export class Player {
  entity: Entity;
  constructor(entityId: number, game: Game) {
    this.entity = game.entityManager.createEntity(
      SerializedEntityType.PLAYER,
      entityId
    );

    const meshComponent = new MeshComponent(entityId);
    this.entity.addComponent(meshComponent);
    const mesh: THREE.Mesh = meshComponent.mesh;
    const geometry = new THREE.CapsuleGeometry(1, 2, 1);
    const material = new THREE.MeshPhongMaterial();
    material.transparent = true;
    material.color = new THREE.Color(0xff5522);
    // mesh.geometry = geometry;
    mesh.material = material;
    mesh.receiveShadow = true;
    mesh.castShadow = true;

    if (entityId === game.currentPlayerEntityId) {
      this.entity.addComponent(
        new FollowComponent(entityId, game.renderer.camera)
      );
      const pointLight = new THREE.PointLight(0xff3aff, 15, 50);
      pointLight.position.set(0, 1, 0);
      pointLight.castShadow = true;
      mesh.add(pointLight);
    }

    const loader = game.loadManager;

    loader
      // .glTFLoad("https://myaudio.nyc3.cdn.digitaloceanspaces.com/Walking.glb")
      // .glTFLoad("https://myaudio.nyc3.cdn.digitaloceanspaces.com/Bocky.glb")
      // .glTFLoad(
      //   "https://myaudio.nyc3.cdn.digitaloceanspaces.com/BockyAnimatedLOL.glb"
      // )
      // .glTFLoad("Car.glb")
      .glTFLoad("https://myaudio.nyc3.cdn.digitaloceanspaces.com/Character.glb")
      .then((gtlf: GLTF) => {
        mesh.add(gtlf.scenes[0]);
        this.entity.addComponent(
          new AnimationComponent(this.entity.id, mesh, gtlf.animations)
        );
      });
  }
}
