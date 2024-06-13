"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkKing = void 0;
const logger_1 = require("../logger");
const checkKing = (data) => {
    try {
        logger_1.logger.info(`START checkKing :::: DATA :::: ${JSON.stringify(data)}`);
        const positions = [
            { index: 0, numberOfBox: 1, expectedColor: "R", colorOfKing: "red" },
            { index: 2, numberOfBox: 3, expectedColor: "R", colorOfKing: "red" },
            { index: 4, numberOfBox: 5, expectedColor: "R", colorOfKing: "red" },
            { index: 6, numberOfBox: 7, expectedColor: "R", colorOfKing: "red" },
            { index: 57, numberOfBox: 58, expectedColor: "B", colorOfKing: "black" },
            { index: 59, numberOfBox: 60, expectedColor: "B", colorOfKing: "black" },
            { index: 61, numberOfBox: 62, expectedColor: "B", colorOfKing: "black" },
            { index: 63, numberOfBox: 64, expectedColor: "B", colorOfKing: "black" }
        ];
        for (let pos of positions) {
            let piece = data.tableData[pos.index];
            if (piece && piece.pieceId) {
                if (piece.pieceId !== 'R-king' && piece.pieceId !== 'B-king') {
                    let [color] = piece.pieceId.split('-');
                    if (color === pos.expectedColor) {
                        data = {
                            numberOfBox: pos.numberOfBox,
                            pieceId: piece.pieceId,
                            colorOfKing: pos.colorOfKing
                        };
                        logger_1.logger.info(`END checkKing :::: DATA :::: ${JSON.stringify(data)}`);
                        return data;
                    }
                }
            }
        }
        logger_1.logger.info(`END checkKing :::: DATA :::: ${JSON.stringify(data)}`);
        return false;
    }
    catch (error) {
        logger_1.logger.error(`CATCH_ERROR checkKing :::: ${error}`);
    }
};
exports.checkKing = checkKing;
