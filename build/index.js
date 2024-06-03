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
exports.io = void 0;
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const logger_1 = require("./logger");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: './.env' });
const allConnections_1 = require("./connection/allConnections");
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server);
exports.io = io;
(0, allConnections_1.allConnections)();
app.use(express_1.default.json());
app.use(express_1.default.static(path_1.default.join(__dirname, '../public')));
app.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.sendFile(path_1.default.join(__dirname, '../public/index.html'));
}));
const port = process.argv[2] || process.env.PORT || 5000;
server.listen(port, () => __awaiter(void 0, void 0, void 0, function* () {
    logger_1.logger.info(`server listening on port http://localhost:${port}   `);
}));
try {
    process
        .on("unhandledRejection", (response, p) => {
        console.error("unhandledRejection", response);
        console.error("unhandledRejection", p);
        logger_1.logger.error("unhandledRejection", response);
        logger_1.logger.error("unhandledRejection", p);
    })
        .on("uncaughtException", (err) => {
        console.error("uncaughtException", err);
        logger_1.logger.error("uncaughtException", err);
    });
}
catch (error) {
    console.error(error);
    logger_1.logger.error("uncaughtException", error);
}
