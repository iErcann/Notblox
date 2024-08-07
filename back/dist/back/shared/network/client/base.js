export var ClientMessageType;
(function (ClientMessageType) {
    ClientMessageType[ClientMessageType["FIRST_CONNECTION"] = 0] = "FIRST_CONNECTION";
    ClientMessageType[ClientMessageType["INPUT"] = 1] = "INPUT";
    ClientMessageType[ClientMessageType["CHAT_MESSAGE"] = 2] = "CHAT_MESSAGE";
    ClientMessageType[ClientMessageType["TRANSFORM_UPDATE"] = 3] = "TRANSFORM_UPDATE";
    ClientMessageType[ClientMessageType["TOGGLE_TRANSFORM_CONTROLS"] = 4] = "TOGGLE_TRANSFORM_CONTROLS";
    ClientMessageType[ClientMessageType["ENTITY_POSITION_UPDATE"] = 5] = "ENTITY_POSITION_UPDATE";
    ClientMessageType[ClientMessageType["ENTITY_ROTATION_UPDATE"] = 6] = "ENTITY_ROTATION_UPDATE";
    ClientMessageType[ClientMessageType["ENTITY_SCALE_UPDATE"] = 7] = "ENTITY_SCALE_UPDATE";
})(ClientMessageType || (ClientMessageType = {}));
//# sourceMappingURL=base.js.map