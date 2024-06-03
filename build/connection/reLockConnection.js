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
exports.RemoveLock = exports.ApplyLock = exports.RedLockConnction = void 0;
const redlock_1 = __importDefault(require("redlock"));
const ioredis_1 = __importDefault(require("ioredis"));
const logger_1 = require("../logger");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
let redisOption = {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD,
    db: process.env.REDIS_DB
};
let redLock;
const RedLockConnction = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const redisClient = new ioredis_1.default(redisOption);
        redLock = new redlock_1.default([redisClient], {
            driftFactor: 0.01,
            retryCount: -1,
            retryDelay: 25,
            retryJitter: 20,
            // automaticExtensionThreshold: 500
        });
        redLock.on('error', (error) => __awaiter(void 0, void 0, void 0, function* () { logger_1.logger.error("Error with redlock"); }));
        logger_1.logger.info("Connected redLock Successfully !!!");
    }
    catch (error) {
        logger_1.logger.error(`CATCH_ERROR RedLockConnction :: ${error}`);
    }
    ;
});
exports.RedLockConnction = RedLockConnction;
const ApplyLock = (Path, LockId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield logger_1.logger.info("ApplyLock", JSON.stringify({ Path, LockId }));
        const Lock = yield redLock.acquire([LockId], 5 * 1000);
        return Lock;
    }
    catch (error) {
        yield logger_1.logger.error(`CATCH_ERROR ApplyLock :: ${error}`);
    }
    ;
});
exports.ApplyLock = ApplyLock;
const RemoveLock = (Path, Lock) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield logger_1.logger.info("RemoveLock", JSON.stringify({ Path, LockId: Lock === null || Lock === void 0 ? void 0 : Lock.resources }));
        yield Lock.release();
    }
    catch (error) {
        yield logger_1.logger.error(`CATCH_ERROR RemoveLock :: ${error}`);
    }
    ;
});
exports.RemoveLock = RemoveLock;
