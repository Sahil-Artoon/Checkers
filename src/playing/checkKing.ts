import { logger } from "../logger"

const checkKing = (data: any) => {
    try {
        logger.info(`START checkKing :::: DATA :::: ${JSON.stringify(data)}`)
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
                    console.log("::::::::::::::::::::::: COLOR IN CHECKKING :::::::::::::::::::::::")
                    console.log(color)
                    if (color === pos.expectedColor) {
                        data = {
                            numberOfBox: pos.numberOfBox,
                            pieceId: piece.pieceId,
                            colorOfKing: pos.colorOfKing
                        };
                        logger.info(`END checkKing :::: DATA :::: ${JSON.stringify(data)}`)
                        return data
                    }
                }
            }
        }
        logger.info(`END checkKing :::: DATA :::: ${JSON.stringify(data)}`)
        return false;
    } catch (error) {
        logger.error(`CATCH_ERROR checkKing :::: ${error}`)
    }
}

export { checkKing }