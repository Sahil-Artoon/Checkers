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
exports.joinTable = void 0;
const joinBotQueue_1 = require("../bull/Queue/joinBotQueue");
const generateId_1 = require("../common/generateId");
const bullTimer_1 = require("../constant/bullTimer");
const gameStatus_1 = require("../constant/gameStatus");
const redisConstant_1 = require("../constant/redisConstant");
const socketEventName_1 = require("../constant/socketEventName");
const eventEmmitter_1 = require("../eventEmmitter");
const logger_1 = require("../logger");
const redisOption_1 = require("../redisOption");
const joinTableValidation_1 = require("../validation/joinTableValidation");
const joinTable = (data, socket) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        logger_1.logger.info(`START joinTable :::: DATA :::: ${JSON.stringify(data)}`);
        let checkData = yield (0, joinTableValidation_1.joinTableValidation)(data);
        if (checkData === null || checkData === void 0 ? void 0 : checkData.error) {
            data = {
                eventName: socketEventName_1.SOCKET_EVENT_NAME.POP_UP,
                data: {
                    message: checkData.error.details[0].message
                },
                socket
            };
            (0, eventEmmitter_1.sendToSocketIdEmmiter)(data);
            logger_1.logger.info(`END joinTable :::: ${JSON.stringify(data.data)}`);
            return;
        }
        let { _id, userName, isBot, playWithBot, tableId } = data;
        let findUser = yield (0, redisOption_1.redisGet)(`${redisConstant_1.REDIS_EVENT_NAME.USER}:${_id}`);
        findUser = JSON.parse(findUser);
        if (!findUser) {
            data = {
                eventName: socketEventName_1.SOCKET_EVENT_NAME.POP_UP,
                data: {
                    message: `Can't found User By _id.`
                },
                socket
            };
            (0, eventEmmitter_1.sendToSocketIdEmmiter)(data);
            logger_1.logger.info(`END joinTable :::: ${JSON.stringify(data.data)}`);
            return;
        }
        if (tableId) {
            console.log(":::::::::::::::::::::::::::::::");
            console.log("Inside Table Id ");
            console.log(":::::::::::::::::::::::::::::::");
            let findTable = yield (0, redisOption_1.redisGet)(`${redisConstant_1.REDIS_EVENT_NAME.TABLE}:${tableId}`);
            findTable = JSON.parse(findTable);
            if (findTable) {
                findTable.playerInfo.push({
                    userId: _id,
                    userName,
                    isBot,
                    isActive: true
                });
                findTable.activePlayer = findTable.activePlayer + 1;
                yield (0, redisOption_1.redisDel)(`${redisConstant_1.REDIS_EVENT_NAME.TABLE}: ${findTable._id}`);
                yield (0, redisOption_1.redisSet)(`${redisConstant_1.REDIS_EVENT_NAME.TABLE}:${findTable._id}`, findTable);
                findTable = yield (0, redisOption_1.redisGet)(`${redisConstant_1.REDIS_EVENT_NAME.TABLE}:${findTable._id}`);
                findTable = JSON.parse(findTable);
                logger_1.logger.info(`END joinTable PlayWithBot :::: ${JSON.stringify(findTable)}`);
                return;
            }
        }
        else {
            let findtableByQueue = yield (0, redisOption_1.redisGet)(redisConstant_1.REDIS_EVENT_NAME.QUEUE);
            findtableByQueue = JSON.parse(findtableByQueue);
            if (playWithBot == true)
                findtableByQueue = false;
            if (findtableByQueue) {
                console.log("FINDTABLEBYQUEUE :::: ", findtableByQueue);
                let idOfTable;
                if (findtableByQueue.length == 1) {
                    idOfTable = findtableByQueue[0];
                    yield (0, redisOption_1.redisDel)(redisConstant_1.REDIS_EVENT_NAME.QUEUE);
                }
                else {
                    idOfTable = findtableByQueue[findtableByQueue.length - 1];
                    yield (0, redisOption_1.redisDel)(redisConstant_1.REDIS_EVENT_NAME.QUEUE);
                    findtableByQueue.pop();
                    yield (0, redisOption_1.redisSet)(redisConstant_1.REDIS_EVENT_NAME.QUEUE, findtableByQueue);
                }
                let findTable = yield (0, redisOption_1.redisGet)(`${redisConstant_1.REDIS_EVENT_NAME.TABLE}:${idOfTable}`);
                findTable = JSON.parse(findTable);
                if (findTable) {
                    findTable.playerInfo.push({
                        userId: _id,
                        userName,
                        isBot,
                        isActive: true
                    });
                    findTable.activePlayer = findTable.activePlayer + 1;
                    yield (0, redisOption_1.redisDel)(`${redisConstant_1.REDIS_EVENT_NAME.TABLE}: ${findTable._id}`);
                    yield (0, redisOption_1.redisSet)(`${redisConstant_1.REDIS_EVENT_NAME.TABLE}:${findTable._id}`, findTable);
                    findTable = yield (0, redisOption_1.redisGet)(`${redisConstant_1.REDIS_EVENT_NAME.TABLE}:${findTable._id}`);
                    findTable = JSON.parse(findTable);
                    if (isBot == false) {
                        data = {
                            eventName: socketEventName_1.SOCKET_EVENT_NAME.JOIN_TABLE,
                            data: {
                                data: findTable,
                                message: "ok"
                            },
                            socket
                        };
                        (0, eventEmmitter_1.sendToSocketIdEmmiter)(data);
                        return;
                    }
                }
            }
            else {
                let generateTableId = yield (0, generateId_1.generateId)();
                data = {
                    _id: generateTableId,
                    playerInfo: [{
                            userId: _id,
                            userName,
                            isBot,
                            isActive: true
                        }],
                    tableData: [
                        {
                            pieceId: 'B1',
                            place: 1
                        },
                        { place: 2 },
                        {
                            pieceId: 'B2',
                            place: 3
                        },
                        { place: 4 },
                        {
                            pieceId: 'B3',
                            place: 5
                        },
                        { place: 6 },
                        {
                            pieceId: 'B4',
                            place: 7
                        },
                        { place: 8 },
                        { place: 9 },
                        {
                            pieceId: 'B5',
                            place: 10
                        },
                        { place: 11 },
                        {
                            pieceId: 'B6',
                            place: 12
                        },
                        { place: 13 },
                        {
                            pieceId: 'B7',
                            place: 14
                        },
                        { place: 15 },
                        {
                            pieceId: 'B8',
                            place: 16
                        },
                        {
                            pieceId: 'B9',
                            place: 17
                        },
                        { place: 18 },
                        {
                            pieceId: 'B10',
                            place: 19
                        },
                        { place: 20 },
                        {
                            pieceId: 'B11',
                            place: 21
                        },
                        { place: 22 },
                        {
                            pieceId: 'B12',
                            place: 23
                        },
                        { place: 24 },
                        { place: 25 },
                        { place: 26 },
                        { place: 27 },
                        { place: 28 },
                        { place: 29 },
                        { place: 30 },
                        { place: 31 },
                        { place: 32 },
                        { place: 33 },
                        { place: 34 },
                        { place: 35 },
                        { place: 36 },
                        { place: 37 },
                        { place: 38 },
                        { place: 39 },
                        { place: 40 },
                        { place: 41 },
                        {
                            pieceId: 'R1',
                            place: 42
                        },
                        { place: 43 },
                        {
                            pieceId: "R2",
                            place: 44
                        },
                        { place: 45 },
                        {
                            pieceId: "R3",
                            place: 46
                        },
                        { place: 47 },
                        {
                            pieceId: "R4",
                            place: 48
                        },
                        {
                            pieceId: "R5",
                            place: 49
                        },
                        {
                            place: 50
                        },
                        {
                            pieceId: "R6",
                            place: 51
                        },
                        { place: 52 },
                        {
                            pieceId: "R7",
                            place: 53
                        },
                        { place: 54 },
                        {
                            pieceId: "R8",
                            place: 55
                        },
                        { place: 56 },
                        { place: 57 },
                        {
                            pieceId: "R9",
                            place: 58
                        },
                        { place: 59 },
                        {
                            pieceId: "R10",
                            place: 60
                        },
                        { place: 61 },
                        {
                            pieceId: "R11",
                            place: 62
                        },
                        { place: 63 },
                        {
                            pieceId: "R12",
                            place: 64
                        }
                    ],
                    playWithBot: playWithBot,
                    activePlayer: 1,
                    currentTurnSeatIndex: null,
                    winnerSeatIndex: null,
                    gameStatus: gameStatus_1.GAME_STATUS.WAITING
                };
                yield (0, redisOption_1.redisSet)(`${redisConstant_1.REDIS_EVENT_NAME.TABLE}:${generateTableId}`, data);
                let findTable = yield (0, redisOption_1.redisGet)(`${redisConstant_1.REDIS_EVENT_NAME.TABLE}:${generateTableId}`);
                findTable = JSON.parse(findTable);
                if (!findTable) {
                    data = {
                        eventName: socketEventName_1.SOCKET_EVENT_NAME.POP_UP,
                        data: {
                            message: `Can't found Table By generateTableId.`
                        },
                        socket
                    };
                    (0, eventEmmitter_1.sendToSocketIdEmmiter)(data);
                    logger_1.logger.info(`END joinTable :::: ${JSON.stringify(data.data)}`);
                    return;
                }
                let queue = yield (0, redisOption_1.redisGet)(redisConstant_1.REDIS_EVENT_NAME.QUEUE);
                queue = JSON.parse(queue);
                if (playWithBot == false) {
                    if (queue) {
                        yield (0, redisOption_1.redisDel)(`${redisConstant_1.REDIS_EVENT_NAME.QUEUE}`);
                        queue.push(findTable._id);
                        yield (0, redisOption_1.redisSet)(`${redisConstant_1.REDIS_EVENT_NAME.QUEUE}`, queue);
                    }
                    else {
                        data = [findTable._id];
                        yield (0, redisOption_1.redisSet)(`${redisConstant_1.REDIS_EVENT_NAME.QUEUE}`, data);
                    }
                }
                socket.join(findTable._id);
                data = {
                    eventName: socketEventName_1.SOCKET_EVENT_NAME.JOIN_TABLE,
                    data: {
                        data: findTable,
                        message: "ok"
                    },
                    socket
                };
                (0, eventEmmitter_1.sendToSocketIdEmmiter)(data);
                if (playWithBot == true) {
                    data = {
                        tableId: findTable._id,
                        timer: bullTimer_1.BULL_TIMER.JOIN_BOT_TIMER
                    };
                    (0, joinBotQueue_1.joinBotQueue)(data, socket);
                }
                logger_1.logger.info(`END joinTable :::: ${JSON.stringify(data.data)}`);
                return;
            }
        }
    }
    catch (error) {
        logger_1.logger.error(`CATCH_ERROR joinTable :::: ${error}`);
    }
});
exports.joinTable = joinTable;
