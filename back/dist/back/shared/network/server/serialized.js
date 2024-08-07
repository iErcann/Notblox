export var SerializedComponentType;
(function (SerializedComponentType) {
    SerializedComponentType[SerializedComponentType["NONE"] = 0] = "NONE";
    SerializedComponentType[SerializedComponentType["POSITION"] = 1] = "POSITION";
    SerializedComponentType[SerializedComponentType["ROTATION"] = 2] = "ROTATION";
    SerializedComponentType[SerializedComponentType["SIZE"] = 3] = "SIZE";
    SerializedComponentType[SerializedComponentType["COLOR"] = 4] = "COLOR";
    SerializedComponentType[SerializedComponentType["DESTROYED_EVENT"] = 5] = "DESTROYED_EVENT";
    SerializedComponentType[SerializedComponentType["SINGLE_SIZE"] = 6] = "SINGLE_SIZE";
    // Used for animations mostly
    SerializedComponentType[SerializedComponentType["STATE"] = 7] = "STATE";
    SerializedComponentType[SerializedComponentType["CHAT_LIST"] = 8] = "CHAT_LIST";
    SerializedComponentType[SerializedComponentType["CHAT_MESSAGE"] = 9] = "CHAT_MESSAGE";
    SerializedComponentType[SerializedComponentType["SERVER_MESH"] = 10] = "SERVER_MESH";
    SerializedComponentType[SerializedComponentType["TRANSFORM_CONTROLS"] = 11] = "TRANSFORM_CONTROLS";
})(SerializedComponentType || (SerializedComponentType = {}));
export var SerializedEntityType;
(function (SerializedEntityType) {
    SerializedEntityType[SerializedEntityType["NONE"] = 0] = "NONE";
    SerializedEntityType[SerializedEntityType["PLAYER"] = 1] = "PLAYER";
    SerializedEntityType[SerializedEntityType["CUBE"] = 2] = "CUBE";
    SerializedEntityType[SerializedEntityType["WORLD"] = 3] = "WORLD";
    SerializedEntityType[SerializedEntityType["SPHERE"] = 4] = "SPHERE";
    SerializedEntityType[SerializedEntityType["CHAT"] = 5] = "CHAT";
    SerializedEntityType[SerializedEntityType["EVENT_QUEUE"] = 6] = "EVENT_QUEUE";
})(SerializedEntityType || (SerializedEntityType = {}));
export var SerializedStateType;
(function (SerializedStateType) {
    SerializedStateType["IDLE"] = "Idle";
    SerializedStateType["WALK"] = "Walk";
    SerializedStateType["RUN"] = "Run";
    SerializedStateType["JUMP"] = "Jump";
    SerializedStateType["ATTACK"] = "Attack";
    SerializedStateType["FALL"] = "Fall";
    SerializedStateType["DEATH"] = "Death";
})(SerializedStateType || (SerializedStateType = {}));
//# sourceMappingURL=serialized.js.map