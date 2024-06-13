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
exports.redisDel = exports.redisSet = exports.redisGet = void 0;
const redisConnection_1 = require("../connection/redisConnection");
const logger_1 = require("../logger");
const redisSet = (key, data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        logger_1.logger.info(`START redisSet ::: ${key}`);
        let dataOfRedisSet = yield redisConnection_1.redis.set(key, JSON.stringify(data));
        logger_1.logger.info(`END redisSet ::: ${key} `);
        return;
    }
    catch (error) {
        logger_1.logger.error(`CATCH_ERROR redisSet :::: ${error}`);
    }
});
exports.redisSet = redisSet;
const redisGet = (key) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        logger_1.logger.info(`START redisGet ::: ${key}`);
        let dataOfRedisGet = yield redisConnection_1.redis.get(key);
        console.log("DATA Of redis Get", dataOfRedisGet);
        logger_1.logger.info(`END redisGet ::: ${key}`);
        return dataOfRedisGet;
    }
    catch (error) {
        logger_1.logger.error(`CATCH_ERROR redisGet :::: ${error}`);
    }
});
exports.redisGet = redisGet;
const redisDel = (key) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        logger_1.logger.info(`START redisDel ::: ${key}`);
        let dataOfRedisDel = yield redisConnection_1.redis.del(key);
        logger_1.logger.info(`END redisDel ::: ${key}`);
        return;
    }
    catch (error) {
        logger_1.logger.error(`CATCH_ERROR redisDel :::: ${error}`);
    }
});
exports.redisDel = redisDel;
