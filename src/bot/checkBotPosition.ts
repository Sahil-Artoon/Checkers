import { logger } from "../logger"

const checkBotPosition = async (table: any) => {
    try {
        logger.info(`START checkBotPosition :::: DATA :::: ${JSON.stringify(table)}`)
        if (table) {
            let checkBotPositions: any = [];
            let cnt = 1;
            table.tableData.forEach(async (item: any) => {
                if (item.pieceId && item.pieceId != null) {
                    if (item.pieceId.split('-')[0] == "B" || item.pieceId.split('-')[1] == "king") {
                        checkBotPositions.push(item.place)
                    }
                }
            })
            return checkBotPositions;
        }
    } catch (error) {
        logger.error(`CATCH_ERROR :::: ${error}`)
    }
}

const checkBestPosition = async (place: any, positions: any) => {
    try {
        logger.info(`START checkBestPosition :::: ${JSON.stringify(positions)}`)
        let placeMapping: any = {
            1: [10],
            3: [10, 12],
            5: [12, 14],
            7: [14, 16],
            10: [17, 19],
            12: [19, 21],
            14: [21, 23],
            16: [23],
            17: [26],
            19: [26, 28],
            21: [28, 30],
            23: [30, 32],
            26: [33, 35],
            28: [35, 37],
            30: [37, 39],
            32: [39],
            33: [42],
            35: [42, 44],
            37: [44, 46],
            39: [46, 48],
            42: [49, 51],
            44: [51, 53],
            46: [53, 55],
            48: [55],
            49: [58],
            51: [58, 60],
            53: [60, 62],
            55: [62, 64],
            58: [],
            60: [],
            62: [],
            64: []
        };
        const resultMapping: any = {
            1: [{ check: 10, push: 19 }],
            3: [{ check: 10, push: 17 }, { check: 12, push: 21 }],
            5: [{ check: 12, push: 19 }, { check: 14, push: 23 }],
            7: [{ check: 14, push: 21 }],
            10: [{ check: 19, push: 28 }],
            12: [{ check: 19, push: 26 }, { check: 21, push: 30 }],
            14: [{ check: 21, push: 28 }, { check: 23, push: 32 }],
            16: [{ check: 23, push: 30 }],
            17: [{ check: 26, push: 35 }],
            19: [{ check: 26, push: 33 }, { check: 28, push: 37 }],
            21: [{ check: 28, push: 35 }, { check: 30, push: 39 }],
            23: [{ check: 30, push: 37 }],
            26: [{ check: 35, push: 44 }],
            28: [{ check: 35, push: 42 }, { check: 37, push: 46 }],
            30: [{ check: 37, push: 44 }, { check: 39, push: 48 }],
            32: [{ check: 39, push: 46 }],
            33: [{ check: 42, push: 51 }],
            35: [{ check: 42, push: 49 }, { check: 44, push: 53 }],
            37: [{ check: 44, push: 51 }, { check: 46, push: 55 }],
            39: [{ check: 46, push: 53 }],
            42: [{ check: 51, push: 60 }],
            44: [{ check: 51, push: 58 }, { check: 53, push: 62 }],
            46: [{ check: 53, push: 60 }, { check: 55, push: 64 }],
            48: [{ check: 55, push: 62 }],
            49: [],
            51: [],
            53: [],
            55: [],
            58: [],
            60: [],
            62: [],
            64: []
        };
        let arr: any = [];
        for (let i = 0; i < positions.length; i++) {
            if (placeMapping[positions[i]]) {
                resultMapping[positions[i]].forEach((item: any) => {
                    if (place[item.check - 1]?.pieceId?.split("-")[0] == "R") {
                        if (place[item.push - 1].pieceId == null) {
                            let data = {
                                position: positions[i],
                                check: item.check,
                                push: item.push
                            }
                            arr.push(data);
                        }
                    }
                });
            }
        }
        for (let i = 0; i < positions.length; i++) {
            if (placeMapping[positions[i]]) {
                placeMapping[positions[i]].forEach((index: any) => {
                    if (!place[index - 1].pieceId) {
                        let data = {
                            position: positions[i],
                            check: 0,
                            push: index
                        }
                        arr.push(data);
                    }
                });
            }
        }
        return arr;

    } catch (error) {
        logger.error(`CATCH_ERROR checkBestPosition:::: ${error} `)
    }
}

export { checkBotPosition, checkBestPosition }