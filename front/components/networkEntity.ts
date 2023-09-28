export interface NetworkEntity {
  entityId: number;
  sync(data: any): void;
  update(lerpValue: number): void;
}
