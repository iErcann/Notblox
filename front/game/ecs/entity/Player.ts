import * as THREE from "three";
import { MeshComponent } from "../component/MeshComponent";

import { GLTF } from "three/examples/jsm/loaders/GLTFLoader.js";

import { Entity } from "@shared/entity/Entity";
import { SerializedEntityType } from "@shared/network/server/serialized";
import { Game } from "@/game/game";
import { FollowComponent } from "../component/FollowComponent";
import { AnimationComponent } from "../component/AnimationComponent";
import {
  CSS3DRenderer,
  CSS3DObject,
} from "three/examples/jsm/renderers/CSS3DRenderer.js";
import { CSS2DObject } from "three/examples/jsm/renderers/CSS2DRenderer.js";
import { TextComponent } from "../component/TextComponent";

export class Player {
  entity: Entity;

  constructor(entityId: number, game: Game) {
    this.entity = game.entityManager.createEntity(
      SerializedEntityType.PLAYER,
      entityId
    );

    const meshComponent = new MeshComponent(entityId);
    this.entity.addComponent(meshComponent);
    let mesh: THREE.Mesh = meshComponent.mesh;

    const loader = game.loadManager;

    loader.glTFLoad("assets/Character.glb").then((gtlf: GLTF) => {
      mesh.add(gtlf.scene.children[0]);
      mesh.animations = gtlf.animations;
      console.log(mesh);

      this.entity.addComponent(
        new AnimationComponent(this.entity.id, mesh, gtlf.animations)
      );
    });

    const isCurrentPlayer = this.entity.id === game.currentPlayerEntityId;
    if (isCurrentPlayer) {
      this.entity.addComponent(
        new FollowComponent(entityId, game.renderer.camera)
      );
      const pointLight = new THREE.PointLight(0xe1afd1, 5, 130);
      mesh.add(pointLight);
    } else {
      const textComponent = new TextComponent(entityId, "Player " + entityId);
      this.entity.addComponent(textComponent);
      textComponent.setFollowedMesh(mesh);
    }

    this.activateShadows();
  }

  activateShadows() {
    const meshComponent = this.entity.getComponent(MeshComponent);

    if (meshComponent) {
      const object3D = meshComponent.mesh;

      // Enable shadows for all child meshes
      object3D.traverse(function (child) {
        if (child instanceof THREE.Mesh) {
          child.castShadow = true; // Make the child mesh cast shadows
          child.receiveShadow = true; // Make the child mesh receive shadows
        }
      });
    }
  }
}
