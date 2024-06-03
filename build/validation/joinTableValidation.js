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
exports.joinTableValidation = void 0;
const joi_1 = __importDefault(require("joi"));
const logger_1 = require("../logger");
const joinTableValidation = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        logger_1.logger.info(`START joinTableValidation :::: DATA :::: ${JSON.stringify(data)}`);
        const joinTableSchema = joi_1.default.object({
            _id: joi_1.default.string().required(),
            userName: joi_1.default.string().required(),
            isBot: joi_1.default.boolean().required(),
            playWithBot: joi_1.default.boolean(),
            tableId: joi_1.default.string(),
        });
        let resultofjoinTable = joinTableSchema.validate(data);
        logger_1.logger.info(`END : signUpValidation :: DATA :: ${JSON.stringify(data)}`);
        return resultofjoinTable;
    }
    catch (error) {
        logger_1.logger.error(`CATCH_ERROR joinTableValidation :::: ${error}`);
    }
});
exports.joinTableValidation = joinTableValidation;
