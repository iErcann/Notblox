import * as THREE from "three";
import { MeshComponent } from "../component/MeshComponent";

import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

import { Entity } from "@shared/entity/Entity";
import { EntityManager } from "@shared/entity/EntityManager";
import { SerializedEntityType } from "@shared/network/server/serialized";

export class Player {
  entity: Entity;
  constructor(entityId: number) {
    this.entity = EntityManager.getInstance().createEntity(
      SerializedEntityType.PLAYER,
      entityId
    );

    const meshComponent = new MeshComponent(entityId);
    this.entity.addComponent(meshComponent);
    const mesh = meshComponent.mesh;
    const geometry = new THREE.BoxGeometry(1, 2, 1);
    const material = new THREE.MeshPhongMaterial();
    material.color = new THREE.Color(0xff5522);
    mesh.geometry = geometry;
    mesh.material = material;
    mesh.receiveShadow = true;
    mesh.castShadow = true;

    const loader = new GLTFLoader();

    // loader.load(
    //   "Roblox.glb",
    //   function (gltf) {
    //     gltf.scene.scale.set(0.51, 0.51, 0.51);
    //     mesh.add(gltf.scene);

    //     gltf.scene.traverse(function (child) {
    //       if (child instanceof THREE.Mesh) {
    //         child.castShadow = true;
    //         child.receiveShadow = true;
    //       }
    //     });
    //     // Adding light
    //     const light = new THREE.DirectionalLight(0xffffff, 1);
    //     light.position.set(0, 10, 0);

    //     gltf.animations;
    //     Array<THREE.AnimationClip>;
    //     gltf.scene;
    //     THREE.Group;
    //     gltf.scenes;
    //     Array<THREE.Group>;
    //     gltf.cameras;
    //     Array<THREE.Camera>;
    //     gltf.asset;
    //     Object;
    //   },
    //   // called while loading is progressing
    //   function (xhr) {
    //     console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
    //   },
    //   // called when loading has errors
    //   function (error) {
    //     console.log("An error happened");
    //   }
    // );
  }
}
