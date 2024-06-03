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
exports.signUp = void 0;
const generateId_1 = require("../common/generateId");
const eventEmmitter_1 = require("../eventEmmitter");
const socketEventName_1 = require("../constant/socketEventName");
const logger_1 = require("../logger");
const redisOption_1 = require("../redisOption");
const signUpValidation_1 = require("../validation/signUpValidation");
const redisConstant_1 = require("../constant/redisConstant");
const signUp = (data, socket) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        logger_1.logger.info(`START signUp :::: DATA :::: ${JSON.stringify(data)}`);
        let checkData = yield (0, signUpValidation_1.signUpValidation)(data);
        if (checkData === null || checkData === void 0 ? void 0 : checkData.error) {
            if (data.isBot == true) {
                data = {
                    eventName: socketEventName_1.SOCKET_EVENT_NAME.POP_UP,
                    data: {
                        message: checkData.error.details[0].message
                    },
                    socket
                };
                (0, eventEmmitter_1.sendToSocketIdEmmiter)(data);
                logger_1.logger.info(`END signUp :::: ${JSON.stringify(data.data)}`);
                return;
            }
            else {
                logger_1.logger.info(`END signUp :::: ${checkData.error.details[0].message}`);
                return checkData.error.details[0].message;
            }
        }
        const { userName, isBot } = data;
        let _id = (0, generateId_1.generateId)();
        socket.userId = _id;
        data = {
            _id,
            userName,
            isBot,
            tableId: ""
        };
        logger_1.logger.info(`signUp Data ${data}`);
        console.log("Sign Up", data);
        yield (0, redisOption_1.redisSet)(`${redisConstant_1.REDIS_EVENT_NAME.USER}:${_id}`, data);
        let User = yield (0, redisOption_1.redisGet)(`${redisConstant_1.REDIS_EVENT_NAME.USER}:${_id}`);
        User = JSON.parse(User);
        if (isBot == true) {
            return User;
        }
        if (isBot == false) {
            data = {
                eventName: socketEventName_1.SOCKET_EVENT_NAME.SIGN_UP,
                data: {
                    User,
                    message: "ok"
                },
                socket
            };
            (0, eventEmmitter_1.sendToSocketIdEmmiter)(data);
            logger_1.logger.info(`END signUp :::: ${JSON.stringify(data.data)}`);
            return;
        }
    }
    catch (error) {
        logger_1.logger.error(`CATCH_ERROR signUp :::: ${error}`);
    }
});
exports.signUp = signUp;
