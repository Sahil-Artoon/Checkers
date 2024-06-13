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
exports.roundTimerQueue = void 0;
const bull_1 = __importDefault(require("bull"));
const redisConnection_1 = require("../../connection/redisConnection");
const queueEvent_1 = require("../../constant/queueEvent");
const logger_1 = require("../../logger");
const turn_1 = require("../../playing/turn");
const roundTimerQueue = (data, socket) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        logger_1.logger.info(`START roundTimerQueue :::: DATA :::: ${JSON.stringify(data)}`);
        let joinBot = new bull_1.default(queueEvent_1.QUEUE_EVENT.ROUND_TIMER, redisConnection_1.redisOption);
        let options = {
            jobId: data.tableId,
            delay: data.timer,
            removeOnComplete: true
        };
        joinBot.add(data, options);
        joinBot.process((data) => __awaiter(void 0, void 0, void 0, function* () {
            (0, turn_1.turn)(data.data.tableId, socket);
        }));
        logger_1.logger.info(`END roundTimerQueue :::`);
    }
    catch (error) {
        logger_1.logger.error(`CATCH_ERROR roundTimerQueue :::: ${error}`);
    }
});
exports.roundTimerQueue = roundTimerQueue;
