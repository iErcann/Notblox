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
    material.color = new THREE.Color(0xff5522);
    mesh.material = material;
    mesh.receiveShadow = true;
    mesh.castShadow = true;

    const isCurrentPlayer = this.entity.id === game.currentPlayerEntityId;
    if (isCurrentPlayer) {
      this.entity.addComponent(
        new FollowComponent(entityId, game.renderer.camera)
      );
      const pointLight = new THREE.PointLight(0xff3aff, 15, 50);
      mesh.add(pointLight);
    }

    const loader = game.loadManager;

    loader
      .glTFLoad("https://myaudio.nyc3.cdn.digitaloceanspaces.com/Character.glb")
      .then((gtlf: GLTF) => {
        mesh.add(gtlf.scenes[0]);
        this.entity.addComponent(
          new AnimationComponent(this.entity.id, mesh, gtlf.animations)
        );
      });

    this.activateShadows();

    if (!isCurrentPlayer) {
      this.addPlayerNameText(mesh);
    }
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

  addPlayerNameText(mesh: THREE.Mesh) {
    const playerNameElement = document.createElement("div");
    playerNameElement.textContent = "Player";
    playerNameElement.style.color = "#FFFFFF";
    playerNameElement.style.backgroundColor = "rgba(0, 0, 0, 0.2)";
    playerNameElement.style.padding = "5px";
    playerNameElement.style.fontFamily = "Arial, sans-serif";
    playerNameElement.style.fontSize = "14px";

    const cssObject = new CSS2DObject(playerNameElement);
    cssObject.position.set(0, 3, 0);

    mesh.add(cssObject);
  }
}
