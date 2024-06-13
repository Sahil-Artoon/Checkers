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
exports.reJoinValidation = void 0;
const joi_1 = __importDefault(require("joi"));
const logger_1 = require("../logger");
const reJoinValidation = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        logger_1.logger.info(`START reJoinValidation :::: DATA :::: ${JSON.stringify(data)}`);
        const reJoinSchema = joi_1.default.object({
            tableId: joi_1.default.string().required(),
            userId: joi_1.default.string().required(),
        });
        let resultOfReJoin = reJoinSchema.validate(data);
        logger_1.logger.info(`END : reJoinValidation :: DATA :: ${JSON.stringify(data)}`);
        return resultOfReJoin;
    }
    catch (error) {
        logger_1.logger.error(`CATCH_ERROR reJoinValidation :::: ${error}`);
    }
});
exports.reJoinValidation = reJoinValidation;
