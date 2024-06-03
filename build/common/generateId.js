"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateId = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const logger_1 = require("../logger");
const generateId = () => {
    try {
        logger_1.logger.info(`START generateId :::: `);
        let _id = new mongoose_1.default.mongo.ObjectId();
        _id = _id.toString();
        logger_1.logger.info(`END generateId :::: ${_id}`);
        return _id;
    }
    catch (error) {
        logger_1.logger.error(`CATCH_ERROR generateId :::: ${(error)}`);
    }
};
exports.generateId = generateId;
