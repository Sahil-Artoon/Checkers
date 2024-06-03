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
exports.redisSub = exports.redisPub = exports.redisOption = exports.connectRedis = exports.redis = void 0;
const redis_1 = require("redis");
const logger_1 = require("../logger");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
let redisOption = {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
};
exports.redisOption = redisOption;
const redis = (0, redis_1.createClient)(redisOption);
exports.redis = redis;
const redisPub = (0, redis_1.createClient)(redisOption);
exports.redisPub = redisPub;
const redisSub = (0, redis_1.createClient)(redisOption);
exports.redisSub = redisSub;
const connectRedis = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        redis.connect();
        redis.on("connect", () => {
            logger_1.logger.info("Redis Connected...");
            redis.flushDb();
        });
        redis.on('error', (error) => {
            logger_1.logger.error(`CATCH_ERROR connectRedis :: ${error}`);
        });
    }
    catch (error) {
        logger_1.logger.error(`CATCH_ERROR connectRedis :: ${error}`);
    }
});
exports.connectRedis = connectRedis;
