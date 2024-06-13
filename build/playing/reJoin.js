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
exports.reJoin = void 0;
const gameStatus_1 = require("../constant/gameStatus");
const redisConstant_1 = require("../constant/redisConstant");
const socketEventName_1 = require("../constant/socketEventName");
const eventEmmitter_1 = require("../eventEmmitter");
const logger_1 = require("../logger");
const redisOption_1 = require("../redisOption");
const reJoinValidation_1 = require("../validation/reJoinValidation");
const reJoin = (data, socket) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        logger_1.logger.info(`START reJoin :::: DATA :::: ${JSON.stringify(data)}`);
        let checkData = yield (0, reJoinValidation_1.reJoinValidation)(data);
        if (checkData === null || checkData === void 0 ? void 0 : checkData.error) {
            data = {
                eventName: socketEventName_1.SOCKET_EVENT_NAME.POP_UP,
                data: {
                    message: checkData.error.details[0].message
                },
                socket
            };
            (0, eventEmmitter_1.sendToSocketIdEmmiter)(data);
            logger_1.logger.info(`END reJoin :::: ${JSON.stringify(data.data)}`);
            return;
        }
        let { tableId, userId } = data;
        let findUser = yield (0, redisOption_1.redisGet)(`${redisConstant_1.REDIS_EVENT_NAME.USER}:${userId}`);
        findUser = JSON.parse(findUser);
        if (findUser.tableId !== tableId) {
            data = {
                eventName: socketEventName_1.SOCKET_EVENT_NAME.POP_UP,
                data: {
                    message: 'User tableId and tableId is not Match !!!'
                },
                socket
            };
            (0, eventEmmitter_1.sendToSocketIdEmmiter)(data);
            logger_1.logger.info(`END reJoin :::: ${JSON.stringify(data.data)}`);
            return;
        }
        let findTable = yield (0, redisOption_1.redisGet)(`${redisConstant_1.REDIS_EVENT_NAME.TABLE}:${tableId}`);
        findTable = JSON.parse(findTable);
        if (findTable) {
            if (findTable.gameStatus === gameStatus_1.GAME_STATUS.WAITING) {
                if (findTable.activePlayer == 1) {
                    yield (0, redisOption_1.redisDel)(`${redisConstant_1.REDIS_EVENT_NAME.TABLE}:${tableId}`);
                    let findQueue = yield (0, redisOption_1.redisGet)(`${redisConstant_1.REDIS_EVENT_NAME.QUEUE}`);
                    findQueue = JSON.parse(findQueue);
                    if (findQueue.length == 1) {
                        yield (0, redisOption_1.redisDel)(`${redisConstant_1.REDIS_EVENT_NAME.QUEUE}`);
                    }
                    else {
                        let index = findQueue.indexOf(tableId);
                        if (index !== -1) {
                            findQueue.splice(index, 1);
                        }
                        yield (0, redisOption_1.redisDel)(`${redisConstant_1.REDIS_EVENT_NAME.QUEUE}`);
                        yield (0, redisOption_1.redisSet)(`${redisConstant_1.REDIS_EVENT_NAME.QUEUE}`, findQueue);
                    }
                    findUser.tableId = "";
                    yield (0, redisOption_1.redisDel)(`${redisConstant_1.REDIS_EVENT_NAME.USER}:${userId}`);
                    yield (0, redisOption_1.redisSet)(`${redisConstant_1.REDIS_EVENT_NAME.USER}:${userId}`, findUser);
                    data = {
                        eventName: socketEventName_1.SOCKET_EVENT_NAME.RE_JOIN,
                        data: {
                            gameStatus: gameStatus_1.GAME_STATUS.WAITING,
                            message: "ok",
                            tableDelete: true
                        },
                        socket
                    };
                    (0, eventEmmitter_1.sendToSocketIdEmmiter)(data);
                    logger_1.logger.info(`END reJoin :::: ${JSON.stringify(data.data)}`);
                    return;
                }
            }
            if (findTable.gameStatus == gameStatus_1.GAME_STATUS.ROUND_TIMER) {
                data = {
                    eventName: socketEventName_1.SOCKET_EVENT_NAME.RE_JOIN,
                    data: {
                        gameStatus: gameStatus_1.GAME_STATUS.ROUND_TIMER,
                        message: "ok",
                        tableId,
                        userId,
                        tableData: findTable.tableData,
                        playerInfo: findTable.playerInfo
                    },
                    socket
                };
                (0, eventEmmitter_1.sendToSocketIdEmmiter)(data);
                logger_1.logger.info(`END reJoin :::: ${JSON.stringify(data.data)}`);
                return;
            }
        }
    }
    catch (error) {
        logger_1.logger.error(`CATCH_ERROR reJoin :::: ${error}`);
    }
});
exports.reJoin = reJoin;
