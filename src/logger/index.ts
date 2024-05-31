import { createLogger, format, transports, addColors } from "winston";
const { combine, timestamp, colorize, prettyPrint, printf } = format;

const logger = createLogger({
    level: 'info',
    format: combine(
        colorize({ all: true }),
        timestamp({ format: "YYYY-MM-DD HH:mm:ss:SSS" }),
        prettyPrint(),
        printf((info) => {
            return `${[info.timestamp]} : ${[info.level]} : ${info.message}`;
        })
    ),
    transports: [
        new transports.Console(),
        new transports.File({
            filename: 'error.log',
            level: 'error',
            format: combine(timestamp(), format.json())
        }),
        new transports.File({
            filename: 'info.log',
            level: 'info',
            format: combine(timestamp(), format.json())
        }),
    ],
});

addColors({
    error: "red",
    warn: "yellow",
    info: "cyan",
    debug: "green",
});

export { logger };