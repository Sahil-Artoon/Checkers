"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
const winston_1 = require("winston");
const { combine, timestamp, colorize, prettyPrint, printf } = winston_1.format;
const logger = (0, winston_1.createLogger)({
    level: 'info',
    format: combine(colorize({ all: true }), timestamp({ format: "YYYY-MM-DD HH:mm:ss:SSS" }), prettyPrint(), printf((info) => {
        return `${[info.timestamp]} : ${[info.level]} : ${info.message}`;
    })),
    transports: [
        new winston_1.transports.Console(),
        new winston_1.transports.File({
            filename: 'error.log',
            level: 'error',
            format: combine(timestamp(), winston_1.format.json())
        }),
        new winston_1.transports.File({
            filename: 'info.log',
            level: 'info',
            format: combine(timestamp(), winston_1.format.json())
        }),
    ],
});
exports.logger = logger;
(0, winston_1.addColors)({
    error: "red",
    warn: "yellow",
    info: "cyan",
    debug: "green",
});
