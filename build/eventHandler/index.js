"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.eventHandler = void 0;
const logger_1 = require("../logger");
const signUp_1 = require("../playing/signUp");
const socketEventName_1 = require("../constant/socketEventName");
const joinTable_1 = require("../playing/joinTable");
const play_1 = require("../playing/play");
const move_1 = require("../playing/move");
const reJoin_1 = require("../playing/reJoin");
const eventHandler = (socket) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        socket.onAny((eventName, data) => {
            logger_1.logger.info(`Request :: Event Name is : ${eventName} :: Data : ${JSON.stringify(data)}`);
            switch (eventName) {
                case socketEventName_1.SOCKET_EVENT_NAME.SIGN_UP:
                    (0, signUp_1.signUp)(data, socket);
                    break;
                case socketEventName_1.SOCKET_EVENT_NAME.JOIN_TABLE:
                    (0, joinTable_1.joinTable)(data, socket);
                    break;
                case socketEventName_1.SOCKET_EVENT_NAME.PLAY:
                    (0, play_1.playGame)(data, socket);
                    break;
                case socketEventName_1.SOCKET_EVENT_NAME.MOVE:
                    (0, move_1.move)(data, socket);
                    break;
                case socketEventName_1.SOCKET_EVENT_NAME.RE_JOIN:
                    (0, reJoin_1.reJoin)(data, socket);
                    break;
            }
        });
    }
    catch (error) {
        logger_1.logger.error("eventHandler ::::::::::", error);
    }
});
exports.eventHandler = eventHandler;
