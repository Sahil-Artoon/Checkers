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
exports.botJoinTable = void 0;
const logger_1 = require("../logger");
const joinTable_1 = require("../playing/joinTable");
const botJoinTable = (data, socket) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        logger_1.logger.info(`START botJoinTable :::: ${JSON.stringify(data)}`);
        data = {
            _id: data._id,
            userName: data.userName,
            isBot: data.isBot,
            tableId: data.tableId
        };
        (0, joinTable_1.joinTable)(data, socket);
        logger_1.logger.info(`END botJoinTable ::: ${JSON.stringify(data)}`);
    }
    catch (error) {
        logger_1.logger.error(`CATCH_ERROR botJoinTable :::: ${error}`);
    }
});
exports.botJoinTable = botJoinTable;
