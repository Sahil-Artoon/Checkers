"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendToRoomEmmiter = exports.sendToSocketIdEmmiter = void 0;
const logger_1 = require("../logger");
const __1 = require("..");
const sendToSocketIdEmmiter = (data) => {
    try {
        logger_1.logger.info(`RESPONSE EVENT NAME :: ${data.eventName} DATA :: ${JSON.stringify(data.data)}`);
        __1.io.to(data.socket.id).emit(data.eventName, data.data);
    }
    catch (error) {
        logger_1.logger.error(`CATCH_ERROR sendToSocketIdEmmiter :: ${error}`);
    }
};
exports.sendToSocketIdEmmiter = sendToSocketIdEmmiter;
const sendToRoomEmmiter = (data) => {
    try {
        logger_1.logger.info(`RESPONSE EVENT NAME :: ${data.eventName} DATA :: ${JSON.stringify(data.data)}`);
        __1.io.to(data.data._id).emit(data.eventName, data.data);
    }
    catch (error) {
        logger_1.logger.error(`CATCH_ERROR sendToSocketIdEmmiter :: ${error}`);
    }
};
exports.sendToRoomEmmiter = sendToRoomEmmiter;
