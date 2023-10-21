import * as THREE from "three";
import { MeshComponent } from "../component/MeshComponent";

import { GLTF } from "three/examples/jsm/loaders/GLTFLoader.js";

import { Entity } from "@shared/entity/Entity";
import { SerializedEntityType } from "@shared/network/server/serialized";
import { Game } from "@/components/game";
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
    const mesh = meshComponent.mesh;
    const geometry = new THREE.BoxGeometry(1, 2, 1);
    const material = new THREE.MeshPhongMaterial();
    material.color = new THREE.Color(0xff5522);
    //mesh.geometry = geometry;
    mesh.material = material;
    mesh.receiveShadow = true;
    mesh.castShadow = true;

    if (entityId === game.currentPlayerId) {
      this.entity.addComponent(
        new FollowComponent(entityId, game.renderer.camera)
      );
    }

    const pointLight = new THREE.PointLight(0xff3aff, 15, 20);
    // pointLight.castShadow = true;
    mesh.add(pointLight);

    const loader = game.loadManager;

    loader
      // .glTFLoad("https://myaudio.nyc3.cdn.digitaloceanspaces.com/Walking.glb")
      // .glTFLoad("https://myaudio.nyc3.cdn.digitaloceanspaces.com/Bocky.glb")
      .glTFLoad(
        "https://myaudio.nyc3.cdn.digitaloceanspaces.com/BockyAnimatedLOL.glb"
      )
      //.glTFLoad("Sketchbook.glb")
      //.glTFLoad("MixamoTestBocky.glb")

      .then((gtlf: GLTF) => {
        mesh.add(gtlf.scenes[0]);
        mesh.scale.set(0.4, 0.4, 0.4);
        this.entity.addComponent(
          new AnimationComponent(this.entity.id, mesh, gtlf.animations)
        );
      });
  }
}
