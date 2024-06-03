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
exports.socketConnection = void 0;
const eventHandler_1 = require("../eventHandler");
const index_1 = require("../index");
const logger_1 = require("../logger");
const redis_adapter_1 = require("@socket.io/redis-adapter");
const redisConnection_1 = require("./redisConnection");
const disconnect_1 = require("../playing/disconnect");
const socketConnection = () => {
    try {
        Promise.all([redisConnection_1.redisPub.connect(), redisConnection_1.redisSub.connect()])
            .then(() => {
            index_1.io.adapter((0, redis_adapter_1.createAdapter)(redisConnection_1.redisPub, redisConnection_1.redisSub));
        }).catch((error) => {
            logger_1.logger.error(`CATCH_ERROR socketConnection in ioAdapter :: ${error}`);
        });
        index_1.io.on('connection', (socket) => __awaiter(void 0, void 0, void 0, function* () {
            logger_1.logger.info(`SocketId is:::: ${socket.id}`);
            yield (0, eventHandler_1.eventHandler)(socket);
            socket.on("disconnect", () => {
                (0, disconnect_1.disconnectSocket)(socket);
            });
        }));
    }
    catch (error) {
        logger_1.logger.error(`CATCH_ERROR socketConnection :: ${error}`);
    }
};
exports.socketConnection = socketConnection;
