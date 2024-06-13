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
exports.turn = void 0;
const gameStatus_1 = require("../constant/gameStatus");
const redisConstant_1 = require("../constant/redisConstant");
const socketEventName_1 = require("../constant/socketEventName");
const eventEmmitter_1 = require("../eventEmmitter");
const logger_1 = require("../logger");
const redisOption_1 = require("../redisOption");
const turn = (tableId, socket) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        logger_1.logger.info(`START turn :::: DATA ${JSON.stringify(tableId)}`);
        const randomNumber = Math.floor(Math.random() * 100) + 1;
        let ramdomNumberForGiveUserTurn = 1;
        if (randomNumber % 2 == 1) {
            ramdomNumberForGiveUserTurn = 1;
        }
        else {
            ramdomNumberForGiveUserTurn = 0;
        }
        console.log("TURN of THIS PLAYER ", ramdomNumberForGiveUserTurn);
        let findTable = yield (0, redisOption_1.redisGet)(`${redisConstant_1.REDIS_EVENT_NAME.TABLE}:${tableId}`);
        findTable = JSON.parse(findTable);
        if (findTable) {
            findTable.currentTurnSeatIndex = ramdomNumberForGiveUserTurn;
            findTable.currentTurnUserId = findTable === null || findTable === void 0 ? void 0 : findTable.playerInfo[ramdomNumberForGiveUserTurn].userId;
            findTable.gameStatus = gameStatus_1.GAME_STATUS.PLAYING;
            yield (0, redisOption_1.redisDel)(`${redisConstant_1.REDIS_EVENT_NAME.TABLE}:${findTable._id}`);
            yield (0, redisOption_1.redisSet)(`${redisConstant_1.REDIS_EVENT_NAME.TABLE}:${findTable._id}`, findTable);
            let data = {
                eventName: socketEventName_1.SOCKET_EVENT_NAME.TURN,
                data: {
                    _id: findTable === null || findTable === void 0 ? void 0 : findTable._id,
                    color: findTable === null || findTable === void 0 ? void 0 : findTable.playerInfo[ramdomNumberForGiveUserTurn].color,
                    userId: findTable === null || findTable === void 0 ? void 0 : findTable.playerInfo[ramdomNumberForGiveUserTurn].userId,
                    message: "ok"
                }
            };
            (0, eventEmmitter_1.sendToRoomEmmiter)(data);
        }
    }
    catch (error) {
        logger_1.logger.error(`CATCH_ERROR turn :::: ${error}`);
    }
});
exports.turn = turn;
