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
exports.allConnections = void 0;
const logger_1 = require("../logger");
const dbConnection_1 = require("./dbConnection");
const reLockConnection_1 = require("./reLockConnection");
const redisConnection_1 = require("./redisConnection");
const socketConnection_1 = require("./socketConnection");
const allConnections = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, redisConnection_1.connectRedis)();
        yield (0, socketConnection_1.socketConnection)();
        yield (0, reLockConnection_1.RedLockConnction)();
        yield (0, dbConnection_1.connectDb)();
    }
    catch (error) {
        logger_1.logger.error(`CATCH_ERROR allConnections :: ${error}`);
    }
});
exports.allConnections = allConnections;
