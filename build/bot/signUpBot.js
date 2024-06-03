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
exports.signUpBot = void 0;
const logger_1 = require("../logger");
const signUp_1 = require("../playing/signUp");
const botJoinTable_1 = require("./botJoinTable");
const signUpBot = (tableId, socket) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        logger_1.logger.info(`START signUpBot ::::`);
        const characters = 'abcdefghijklmnopqrstuvwxyz';
        let result = '';
        for (let i = 0; i < 5; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            result += characters[randomIndex];
        }
        console.log("result :::: ::::: :::: :::: ", result);
        let data = {
            userName: result,
            isBot: true
        };
        let dataOfBot = yield (0, signUp_1.signUp)(data, socket);
        dataOfBot.tableId = tableId;
        if (dataOfBot) {
            (0, botJoinTable_1.botJoinTable)(dataOfBot, socket);
        }
        logger_1.logger.info(`END signUpBot :::: DATA ${JSON.stringify(data)}`);
        return;
    }
    catch (error) {
        logger_1.logger.error(`CATCH_ERROR signUpBot :::: ${error}`);
    }
});
exports.signUpBot = signUpBot;
