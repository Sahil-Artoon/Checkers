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
exports.move = void 0;
const reStartQueue_1 = require("../bull/Queue/reStartQueue");
const gameStatus_1 = require("../constant/gameStatus");
const redisConstant_1 = require("../constant/redisConstant");
const socketEventName_1 = require("../constant/socketEventName");
const eventEmmitter_1 = require("../eventEmmitter");
const logger_1 = require("../logger");
const redisOption_1 = require("../redisOption");
const moveValidation_1 = require("../validation/moveValidation");
const changeTurn_1 = require("./changeTurn");
const checkKing_1 = require("./checkKing");
const checkWinner_1 = require("./checkWinner");
const move = (data, socket) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        logger_1.logger.info(`START move :::: DATA :::: ${JSON.stringify(data)}`);
        let checkData = yield (0, moveValidation_1.moveValidation)(data);
        if (checkData === null || checkData === void 0 ? void 0 : checkData.error) {
            data = {
                eventName: socketEventName_1.SOCKET_EVENT_NAME.POP_UP,
                data: {
                    message: checkData.error.details[0].message
                },
                socket
            };
            (0, eventEmmitter_1.sendToSocketIdEmmiter)(data);
            logger_1.logger.error(`END move :::: ${JSON.stringify(data.data.message)}`);
            return;
        }
        let { movePiece, tableId, movePosition, userId, dataOfPlay } = data;
        console.log(`movePiece :::: ${movePiece}`);
        console.log(`tableId :::: ${tableId}`);
        console.log(`movePosition :::: ${movePosition}`);
        console.log(`userId :::: ${userId}`);
        console.log("dataOfPlay :::: ", dataOfPlay);
        let parts = movePiece.split("-");
        let movePieceBox = parts[1];
        let part = movePosition.split("-");
        let moviePositionBox = part[1];
        let findTable = yield (0, redisOption_1.redisGet)(`${redisConstant_1.REDIS_EVENT_NAME.TABLE}:${tableId}`);
        findTable = JSON.parse(findTable);
        if (!findTable) {
            data = {
                eventName: socketEventName_1.SOCKET_EVENT_NAME.POP_UP,
                data: {
                    message: `Can't found Table By tableId. ${tableId}`
                },
                socket
            };
            (0, eventEmmitter_1.sendToSocketIdEmmiter)(data);
            logger_1.logger.info(`END joinTable :::: ${JSON.stringify(data.data)}`);
            return;
        }
        if (findTable) {
            let removePiece = null;
            for (let i = 0; i < dataOfPlay.length; i++) {
                if (dataOfPlay[i].check != 0 && moviePositionBox == dataOfPlay[i].push) {
                    findTable.tableData[dataOfPlay[i].check - 1].pieceId = null;
                    removePiece = dataOfPlay[i].check;
                    let checkColor = findTable.playerInfo[findTable.currentTurnSeatIndex].color;
                    if (checkColor == 'red') {
                        findTable.blackTotalLose = findTable.blackTotalLose + 1;
                    }
                    else if (checkColor == 'black') {
                        findTable.redTotalLose = findTable.redTotalLose + 1;
                    }
                    else if (checkColor == 'redKing') {
                        findTable.redTotalLose = findTable.redTotalLose + 1;
                    }
                    else if (checkColor == 'blackKing') {
                        findTable.blackTotalLose = findTable.blackTotalLose + 1;
                    }
                }
            }
            console.log("dataOfplay.length === :::: ", dataOfPlay.length);
            for (let i = 0; i < dataOfPlay.length; i++) {
                console.log(`This is ${dataOfPlay[i]} And Push Is :::: ${dataOfPlay[i].push} `);
                if (dataOfPlay[i].push == moviePositionBox) {
                    console.log("This is Inside of dataOfPlay[i].push :::: ", dataOfPlay[i].push, "and moviePositonBox is :::: ", moviePositionBox);
                    let pieceId = findTable.tableData[movePieceBox - 1].pieceId;
                    findTable.tableData[movePieceBox - 1].pieceId = null;
                    findTable.tableData[moviePositionBox - 1].pieceId = pieceId;
                    yield (0, redisOption_1.redisDel)(`${redisConstant_1.REDIS_EVENT_NAME.TABLE}:${tableId}`);
                    yield (0, redisOption_1.redisSet)(`${redisConstant_1.REDIS_EVENT_NAME.TABLE}:${tableId}`, findTable);
                    findTable = yield (0, redisOption_1.redisGet)(`${redisConstant_1.REDIS_EVENT_NAME.TABLE}:${tableId}`);
                    findTable = JSON.parse(findTable);
                    data = {
                        eventName: socketEventName_1.SOCKET_EVENT_NAME.MOVE,
                        data: {
                            _id: findTable === null || findTable === void 0 ? void 0 : findTable._id,
                            emptyBoxId: movePiece,
                            addBoxId: movePosition,
                            message: "ok",
                            removePiece
                        }
                    };
                    (0, eventEmmitter_1.sendToRoomEmmiter)(data);
                    let checkKingOrNot = yield (0, checkKing_1.checkKing)(findTable);
                    if (checkKingOrNot) {
                        logger_1.logger.info(`checkKingOrNot ::::: ${JSON.stringify(checkKingOrNot)}`);
                        if (checkKingOrNot.colorOfKing == "red") {
                            findTable.tableData[checkKingOrNot.numberOfBox - 1].pieceId = 'R-king';
                        }
                        if (checkKingOrNot.colorOfKing == 'black') {
                            findTable.tableData[checkKingOrNot.numberOfBox - 1].pieceId = 'B-king';
                        }
                        yield (0, redisOption_1.redisDel)(`${redisConstant_1.REDIS_EVENT_NAME.TABLE}:${findTable._id}`);
                        yield (0, redisOption_1.redisSet)(`${redisConstant_1.REDIS_EVENT_NAME.TABLE}:${findTable._id}`, findTable);
                        data = {
                            eventName: socketEventName_1.SOCKET_EVENT_NAME.KING,
                            data: {
                                _id: findTable._id,
                                numberOfBox: checkKingOrNot.numberOfBox,
                                pieceId: checkKingOrNot.pieceId,
                                colorOfKing: checkKingOrNot.colorOfKing,
                                message: "ok"
                            }
                        };
                        (0, eventEmmitter_1.sendToRoomEmmiter)(data);
                    }
                    let checkWinnerOrNot = yield (0, checkWinner_1.checkWinner)(findTable._id);
                    console.log(`This is checkWinnerOrNot :::: `, checkWinnerOrNot);
                    if (checkWinnerOrNot == 0) {
                        return (0, changeTurn_1.changeTurn)(findTable._id, socket);
                    }
                    else {
                        findTable.gameStatus = gameStatus_1.GAME_STATUS.WINNER;
                        findTable.winnerUserId = checkWinnerOrNot;
                        yield (0, redisOption_1.redisDel)(`${redisConstant_1.REDIS_EVENT_NAME.TABLE}:${findTable._id}`);
                        yield (0, redisOption_1.redisSet)(`${redisConstant_1.REDIS_EVENT_NAME.TABLE}:${findTable._id}`, findTable);
                        let userOne = yield (0, redisOption_1.redisGet)(`${redisConstant_1.REDIS_EVENT_NAME.USER}:${findTable.playerInfo[0].userId}`);
                        userOne = JSON.parse(userOne);
                        if (userOne) {
                            userOne.tableId = "";
                        }
                        yield (0, redisOption_1.redisDel)(`${redisConstant_1.REDIS_EVENT_NAME.USER}:${findTable.playerInfo[0].userId}`);
                        yield (0, redisOption_1.redisSet)(`${redisConstant_1.REDIS_EVENT_NAME.USER}:${findTable.playerInfo[0].userId}`, userOne);
                        let userTwo = yield (0, redisOption_1.redisGet)(`${redisConstant_1.REDIS_EVENT_NAME.USER}:${findTable.playerInfo[1].userId}`);
                        userTwo = JSON.parse(userTwo);
                        if (userTwo) {
                            userTwo.tableId = "";
                        }
                        yield (0, redisOption_1.redisDel)(`${redisConstant_1.REDIS_EVENT_NAME.USER}:${findTable.playerInfo[1].userId}`);
                        yield (0, redisOption_1.redisSet)(`${redisConstant_1.REDIS_EVENT_NAME.USER}:${findTable.playerInfo[1].userId}`, userTwo);
                        data = {
                            eventName: socketEventName_1.SOCKET_EVENT_NAME.WINNER,
                            data: {
                                _id: findTable._id,
                                message: "ok",
                                userId: checkWinnerOrNot
                            }
                        };
                        (0, eventEmmitter_1.sendToRoomEmmiter)(data);
                        data = {
                            tableId: findTable._id,
                            timer: 3000
                        };
                        (0, reStartQueue_1.reStartQueue)(data, socket);
                    }
                }
            }
        }
    }
    catch (error) {
        logger_1.logger.error(`CATCH_ERROR move :::: ${error}`);
    }
});
exports.move = move;
