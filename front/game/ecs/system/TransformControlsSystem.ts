import { Entity } from '@shared/entity/Entity'
import { TransformControlsComponent } from '../component/TransformControlsComponent'
import { MeshComponent } from '../component/MeshComponent'
import { TransformControls } from 'three/examples/jsm/controls/TransformControls.js'
import { Renderer } from '@/game/renderer'
import { EventSystem } from '@shared/system/EventSystem'
import { ComponentAddedEvent } from '@shared/component/events/ComponentAddedEvent'
import { ComponentRemovedEvent } from '@shared/component/events/ComponentRemovedEvent'
import { ClientMessageType } from '@shared/network/client/base'
import { EntityManager } from '@shared/system/EntityManager';

export type TransformControlsMode = 'translate' | 'rotate' | 'scale';

export class TransformControlsSystem {
  private enabled: boolean = false;
  private mode: TransformControlsMode = 'translate';

  constructor(private renderer: Renderer, private websocketManager: any) {}

  update(entities: Entity[]) {
    this.handleAddedComponents(entities);
    this.handleRemovedComponents();
    if (this.enabled) {
      this.updateExistingControls(entities);
    }
  }

  private handleAddedComponents(entities: Entity[]) {
    for (const entity of entities) {
      const transformControlsComponent = entity.getComponent(TransformControlsComponent);
      if (transformControlsComponent && !transformControlsComponent.controls) {
        this.setupTransformControls(transformControlsComponent, entity);
      }
    }
  }

  private setupTransformControls(component: TransformControlsComponent, entity: Entity) {
    const meshComponent = entity.getComponent(MeshComponent);
    if (meshComponent && !component.controls) {
      const controls = new TransformControls(this.renderer.camera, this.renderer.domElement);
      controls.attach(meshComponent.mesh);
      this.renderer.scene.add(controls);
      component.controls = controls;

      controls.addEventListener('change', () => {
        if (controls.mode === 'translate') {
          this.sendTransformUpdate(entity);
        } else if (controls.mode === 'rotate') {
          this.sendRotationUpdate(entity);
        } else if (controls.mode === 'scale') {
          this.sendScaleUpdate(entity);
        }
      });
      controls.addEventListener('dragging-changed', (event) => {
        if (this.renderer.orbitControls) {
          this.renderer.orbitControls.enabled = !event.value;
        }
      });

      if (!this.enabled) {
        controls.visible = false;
      }
    }
  }

  private handleRemovedComponents() {
    const removedEvents = EventSystem.getEventsWrapped(ComponentRemovedEvent, TransformControlsComponent);
    for (const removedEvent of removedEvents) {
      const component = removedEvent.component as TransformControlsComponent;
      this.cleanupTransformControls(component);
    }
  }

  private cleanupTransformControls(component: TransformControlsComponent) {
    if (component.controls) {
      this.renderer.scene.remove(component.controls);
      component.controls.dispose();
      component.controls = null;
    }
  }

  private updateExistingControls(entities: Entity[]) {
    for (const entity of entities) {
      const transformControlsComponent = entity.getComponent(TransformControlsComponent);
      if (transformControlsComponent && !transformControlsComponent.controls) {
        this.setupTransformControls(transformControlsComponent, entity);
      }
    }
  }

  private sendTransformUpdate(entity: Entity) {
    const meshComponent = entity.getComponent(MeshComponent);
    if (meshComponent) {
      const position = meshComponent.mesh.position;
      this.websocketManager.send({
        t: ClientMessageType.ENTITY_POSITION_UPDATE,
        entityId: entity.id,
        x: position.x,
        y: position.y,
        z: position.z
      });
    }
  }

  private sendRotationUpdate(entity: Entity) {
    const meshComponent = entity.getComponent(MeshComponent);
    if (meshComponent) {
      const rotation = meshComponent.mesh.quaternion;
      this.websocketManager.send({
        t: ClientMessageType.ENTITY_ROTATION_UPDATE,
        entityId: entity.id,
        x: rotation.x,
        y: rotation.y,
        z: rotation.z,
        w: rotation.w
      });
    }
  }

  private sendScaleUpdate(entity: Entity) {
    const meshComponent = entity.getComponent(MeshComponent);
    if (meshComponent) {
      const scale = meshComponent.mesh.scale;
      this.websocketManager.send({
        t: ClientMessageType.ENTITY_SCALE_UPDATE,
        entityId: entity.id,
        x: scale.x,
        y: scale.y,
        z: scale.z
      });
    }
  }

  handleScaleChange(entity, newScale) {
    // Assuming the entity is a Cube
    const cube = entity.getComponent(CubeComponent); // You might need to create this component
    if (cube) {
      cube.updateScale(newScale.x, newScale.y, newScale.z);
    }

    // Send update to server
    // ... existing code to send update to server ...
  }

  toggleControls() {
    this.enabled = !this.enabled;
    const entities = EntityManager.getInstance().getAllEntities();
    for (const entity of entities) {
      const transformControlsComponent = entity.getComponent(TransformControlsComponent);
      if (transformControlsComponent && transformControlsComponent.controls) {
        transformControlsComponent.controls.visible = this.enabled;
      }
    }
    console.log(`TransformControls ${this.enabled ? 'enabled' : 'disabled'}`);
  }

  setMode(mode: TransformControlsMode) {
    this.mode = mode;
    const entities = EntityManager.getInstance().getAllEntities();
    for (const entity of entities) {
      const transformControlsComponent = entity.getComponent(TransformControlsComponent);
      if (transformControlsComponent && transformControlsComponent.controls) {
        transformControlsComponent.controls.setMode(this.mode);
      }
    }
    console.log(`TransformControls mode set to: ${this.mode}`);
  }

  isEnabled(): boolean {
    return this.enabled;
  }
}