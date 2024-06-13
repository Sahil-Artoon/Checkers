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
exports.moveValidation = void 0;
const joi_1 = __importDefault(require("joi"));
const logger_1 = require("../logger");
const moveValidation = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        logger_1.logger.info(`START moveValidation :::: DATA :::: ${JSON.stringify(data)}`);
        const moveSchema = joi_1.default.object({
            userId: joi_1.default.string().required(),
            movePosition: joi_1.default.string().required(),
            tableId: joi_1.default.string().required(),
            movePiece: joi_1.default.string().required(),
            dataOfPlay: joi_1.default.any().required(),
        });
        let resultOfMove = moveSchema.validate(data);
        logger_1.logger.info(`END : moveValidation :: DATA :: ${JSON.stringify(data)}`);
        return resultOfMove;
    }
    catch (error) {
        logger_1.logger.error(`CATCH_ERROR moveValidation :::: ${error}`);
    }
});
exports.moveValidation = moveValidation;
