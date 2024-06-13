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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTable = void 0;
const bull_1 = __importDefault(require("bull"));
const logger_1 = require("../../logger");
const queueEvent_1 = require("../../constant/queueEvent");
const redisConnection_1 = require("../../connection/redisConnection");
const redisOption_1 = require("../../redisOption");
const redisConstant_1 = require("../../constant/redisConstant");
const gameStatus_1 = require("../../constant/gameStatus");
const deleteTable = (data, socket) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        logger_1.logger.info(`START deleteTable :::: DATA :::: ${JSON.stringify(data)}`);
        let tableDel = new bull_1.default(queueEvent_1.QUEUE_EVENT.DELETE_TABLE, redisConnection_1.redisOption);
        let options = {
            jobId: data.tableId,
            delay: data.timer,
            removeOnComplete: true
        };
        tableDel.add(data, options);
        tableDel.process((data) => __awaiter(void 0, void 0, void 0, function* () {
            let findTable = yield (0, redisOption_1.redisGet)(`${redisConstant_1.REDIS_EVENT_NAME.TABLE}:${data.data.tableId}`);
            findTable = JSON.parse(findTable);
            if (findTable) {
                if (findTable.gameStatus == gameStatus_1.GAME_STATUS.WINNER) {
                    yield (0, redisOption_1.redisDel)(`${redisConstant_1.REDIS_EVENT_NAME.TABLE}:${data.data.tableId}`);
                }
            }
        }));
        logger_1.logger.info(`END deleteTable ::::`);
    }
    catch (error) {
        logger_1.logger.error(`CATCH_ERROR deleteTable :::: ${error}`);
    }
});
exports.deleteTable = deleteTable;
