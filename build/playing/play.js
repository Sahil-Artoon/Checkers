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
exports.playGame = void 0;
const redisConstant_1 = require("../constant/redisConstant");
const socketEventName_1 = require("../constant/socketEventName");
const eventEmmitter_1 = require("../eventEmmitter");
const logger_1 = require("../logger");
const redisOption_1 = require("../redisOption");
const playGameValidation_1 = require("../validation/playGameValidation");
const checkPosition_1 = require("./checkPosition");
const playGame = (data, socket) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        logger_1.logger.info(`START playGame :::: ${JSON.stringify(data)}`);
        let checkData = yield (0, playGameValidation_1.playGameValidation)(data);
        if (checkData === null || checkData === void 0 ? void 0 : checkData.error) {
            data = {
                eventName: socketEventName_1.SOCKET_EVENT_NAME.POP_UP,
                data: {
                    message: checkData.error.details[0].message
                },
                socket
            };
            (0, eventEmmitter_1.sendToSocketIdEmmiter)(data);
            logger_1.logger.info(`END playGame :::: ${JSON.stringify(data.data)}`);
            return;
        }
        let { userId, userName, isBot, position, tableId } = data;
        let findUser = yield (0, redisOption_1.redisGet)(`${redisConstant_1.REDIS_EVENT_NAME.USER}:${userId}`);
        findUser = JSON.parse(findUser);
        if (!findUser) {
            data = {
                eventName: socketEventName_1.SOCKET_EVENT_NAME.POP_UP,
                data: {
                    message: `Can't found User By userId. ${userId}`
                },
                socket
            };
            (0, eventEmmitter_1.sendToSocketIdEmmiter)(data);
            logger_1.logger.info(`END joinTable :::: ${JSON.stringify(data.data)}`);
            return;
        }
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
        if (findTable.currentTurnUserId == userId) {
            let color;
            let parts = position.split("-");
            let numberOfBox = parts[1];
            let checkKingColor = parts[0];
            if (checkKingColor == 'redKing') {
                color = 'redKing';
            }
            else if (checkKingColor == 'blackKing') {
                color = 'blackKing';
            }
            else {
                color = findTable.playerInfo[findTable.currentTurnSeatIndex].color;
            }
            console.log("This is NumberOfBox :::", numberOfBox);
            let place = findTable.tableData;
            let sendPosition = yield (0, checkPosition_1.checkPosition)(numberOfBox, place, color);
            console.log("This is SendPosition :::", sendPosition);
            if (sendPosition) {
                data = {
                    eventName: socketEventName_1.SOCKET_EVENT_NAME.SEND_PLACE,
                    data: {
                        _id: tableId,
                        tableId,
                        userId,
                        userName,
                        isBot,
                        position,
                        sendPosition,
                        message: "ok"
                    }
                };
                (0, eventEmmitter_1.sendToRoomEmmiter)(data);
            }
            else {
                logger_1.logger.error("sendPositon :::: Empty :::: !!!");
            }
        }
    }
    catch (error) {
        logger_1.logger.error(`CATCH_ERROR playGame :::: ${error}`);
    }
});
exports.playGame = playGame;
