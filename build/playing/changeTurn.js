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
exports.changeTurn = void 0;
const redisConstant_1 = require("../constant/redisConstant");
const socketEventName_1 = require("../constant/socketEventName");
const eventEmmitter_1 = require("../eventEmmitter");
const logger_1 = require("../logger");
const redisOption_1 = require("../redisOption");
const changeTurn = (tableId, socket) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        logger_1.logger.info(`START changeTurn :::: DATA :::: ${tableId}`);
        if (tableId) {
            let findTable = yield (0, redisOption_1.redisGet)(`${redisConstant_1.REDIS_EVENT_NAME.TABLE}:${tableId}`);
            findTable = JSON.parse(findTable);
            if (findTable) {
                if (findTable.currentTurnSeatIndex == 0) {
                    let table = yield (0, redisOption_1.redisGet)(`${redisConstant_1.REDIS_EVENT_NAME.TABLE}:${tableId}`);
                    table = JSON.parse(table);
                    table.currentTurnSeatIndex = 1;
                    table.currentTurnUserId = table === null || table === void 0 ? void 0 : table.playerInfo[1].userId;
                    yield (0, redisOption_1.redisDel)(`${redisConstant_1.REDIS_EVENT_NAME.TABLE}:${table._id}`);
                    yield (0, redisOption_1.redisSet)(`${redisConstant_1.REDIS_EVENT_NAME.TABLE}:${table._id}`, table);
                    let data = {
                        eventName: socketEventName_1.SOCKET_EVENT_NAME.CHANGE_TURN,
                        data: {
                            _id: table._id,
                            color: table.playerInfo[1].color,
                            userId: table.playerInfo[1].userId,
                            message: "ok"
                        }
                    };
                    (0, eventEmmitter_1.sendToRoomEmmiter)(data);
                }
                if (findTable.currentTurnSeatIndex == 1) {
                    let table = yield (0, redisOption_1.redisGet)(`${redisConstant_1.REDIS_EVENT_NAME.TABLE}:${tableId}`);
                    table = JSON.parse(table);
                    table.currentTurnSeatIndex = 0;
                    table.currentTurnUserId = table === null || table === void 0 ? void 0 : table.playerInfo[0].userId;
                    yield (0, redisOption_1.redisDel)(`${redisConstant_1.REDIS_EVENT_NAME.TABLE}:${table._id}`);
                    yield (0, redisOption_1.redisSet)(`${redisConstant_1.REDIS_EVENT_NAME.TABLE}:${table._id}`, table);
                    let data = {
                        eventName: socketEventName_1.SOCKET_EVENT_NAME.CHANGE_TURN,
                        data: {
                            _id: table._id,
                            color: table.playerInfo[0].color,
                            userId: table.playerInfo[0].userId,
                            message: "ok"
                        }
                    };
                    (0, eventEmmitter_1.sendToRoomEmmiter)(data);
                }
            }
        }
    }
    catch (error) {
        logger_1.logger.error(`CATCH_ERROR :::: ${error}`);
    }
});
exports.changeTurn = changeTurn;
