import { SerializedComponentType } from "@shared/serialized";
import { Component } from "@shared/component/Component";

export interface Replicated {
  components: Map<SerializedComponentType, Component>;
}
