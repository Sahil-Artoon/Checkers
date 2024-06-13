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
exports.reStartQueue = void 0;
const bull_1 = __importDefault(require("bull"));
const queueEvent_1 = require("../../constant/queueEvent");
const logger_1 = require("../../logger");
const redisConnection_1 = require("../../connection/redisConnection");
const socketEventName_1 = require("../../constant/socketEventName");
const eventEmmitter_1 = require("../../eventEmmitter");
const deleteTableQueue_1 = require("./deleteTableQueue");
const reStartQueue = (data, socket) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        logger_1.logger.info(`START reStartQueue :::: DATA :::: ${JSON.stringify(data)}`);
        let reStart = new bull_1.default(queueEvent_1.QUEUE_EVENT.RE_START, redisConnection_1.redisOption);
        let options = {
            jobId: data.tableId,
            delay: data.timer,
            removeOnComplete: true
        };
        reStart.add(data, options);
        reStart.process((data) => __awaiter(void 0, void 0, void 0, function* () {
            data = {
                eventName: socketEventName_1.SOCKET_EVENT_NAME.RE_START,
                data: {
                    _id: data.data.tableId,
                    message: "ok"
                }
            };
            (0, eventEmmitter_1.sendToRoomEmmiter)(data);
            data = {
                tableId: data.data._id,
                timer: 5000
            };
            (0, deleteTableQueue_1.deleteTable)(data, socket);
        }));
        logger_1.logger.info(`END reStartQueue ::::`);
    }
    catch (error) {
        logger_1.logger.error(`CATCH_ERROR reStartQueue :::: ${error}`);
    }
});
exports.reStartQueue = reStartQueue;
