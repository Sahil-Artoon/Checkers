import { logger } from "../logger"

const checkPosition = async (table: any) => {
    try {
        logger.info(`START checkBotPosition :::: DATA :::: ${JSON.stringify(table)}`)
        if (table) {
            let checkBotPositions: any = [];
            let cnt = 1;
            table.tableData.forEach(async (item: any) => {
                if (item.pieceId && item.pieceId != null) {
                    if (item.pieceId.split('-')[0] == "B" || item.pieceId == "B-king") {
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

const checkBestPosition = async (place: any, p: any) => {
    try {
        logger.info(`START checkBestPosition :::: ${JSON.stringify(p)}`)
        let arr: any = [];
        let checkKing: any = [];
        if (place[p - 1].pieceId == 'B-king') {
            console.log("This is Inside color blackKing")
            let placeMapping: any = {
                1: [10], 3: [10, 12], 5: [12, 14], 7: [14, 16], 10: [1, 3, 17, 19], 12: [3, 5, 19, 21], 14: [5, 7, 21, 23], 16: [7, 23],
                17: [10, 26], 19: [10, 12, 26, 28], 21: [12, 14, 28, 30], 23: [14, 16, 30, 32], 26: [17, 19, 33, 35], 28: [19, 21, 35, 37],
                30: [21, 23, 37, 39], 32: [23, 39], 33: [26, 33], 35: [26, 28, 42, 44], 37: [28, 30, 44, 46], 39: [30, 32, 46, 48],
                42: [33, 35, 49, 51], 44: [35, 37, 51, 53], 46: [37, 39, 53, 55], 48: [39, 55], 49: [42, 58], 51: [42, 44, 58, 60],
                53: [44, 46, 60, 62], 55: [46, 48, 62, 64], 58: [49, 51], 60: [51, 53], 62: [53, 55], 64: [55]
            };

            let pieceCheckMapping: any = {
                64: [{ check: 55, push: 46 }],
                62: [{ check: 53, push: 44 }, { check: 55, push: 48 }],
                60: [{ check: 51, push: 42 }, { check: 53, push: 46 }],
                58: [{ check: 51, push: 44 }],
                55: [{ check: 46, push: 37 }],
                53: [{ check: 46, push: 39 }, { check: 44, push: 35 }],
                51: [{ check: 44, push: 37 }, { check: 42, push: 33 }],
                49: [{ check: 42, push: 35 }],
                48: [{ check: 39, push: 30 }, { check: 55, push: 62 }],
                46: [{ check: 39, push: 32 }, { check: 37, push: 28 }, { check: 53, push: 60 }, { check: 55, push: 64 }],
                44: [{ check: 37, push: 30 }, { check: 35, push: 26 }, { check: 51, push: 58 }, { check: 53, push: 62 }],
                42: [{ check: 35, push: 28 }, { check: 51, push: 60 }],
                39: [{ check: 30, push: 21 }, { check: 46, push: 53 }],
                37: [{ check: 30, push: 23 }, { check: 28, push: 19 }, { check: 46, push: 55 }, { check: 44, push: 51 }],
                35: [{ check: 28, push: 21 }, { check: 26, push: 17 }, { check: 44, push: 53 }, { check: 42, push: 49 }],
                33: [{ check: 26, push: 19 }, { check: 42, push: 51 }],
                32: [{ check: 23, push: 14 }, { check: 39, push: 46 }],
                30: [{ check: 23, push: 16 }, { check: 21, push: 12 }, { check: 39, push: 48 }, { check: 37, push: 44 }],
                28: [{ check: 21, push: 14 }, { check: 19, push: 10 }, { check: 37, push: 46 }, { check: 35, push: 42 }],
                26: [{ check: 19, push: 12 }, { check: 35, push: 44 }],
                23: [{ check: 14, push: 5 }, { check: 30, push: 37 }],
                21: [{ check: 14, push: 7 }, { check: 12, push: 3 }, { check: 30, push: 39 }, { check: 28, push: 35 }],
                19: [{ check: 12, push: 5 }, { check: 10, push: 1 }, { check: 28, push: 37 }, { check: 26, push: 33 }],
                17: [{ check: 10, push: 3 }, { check: 26, push: 35 }],
                16: [{ check: 23, push: 30 }],
                14: [{ check: 21, push: 32 }, { check: 21, push: 28 }],
                12: [{ check: 21, push: 30 }, { check: 19, push: 36 }],
                10: [{ check: 19, push: 28 }],
                7: [{ check: 14, push: 21 }],
                5: [{ check: 14, push: 23 }, { check: 12, push: 19 }],
                3: [{ check: 12, push: 21 }, { check: 10, push: 17 }],
                1: [{ check: 10, push: 19 }]
            };
            if (pieceCheckMapping[p]) {
                pieceCheckMapping[p].forEach((item: any) => {
                    if (place[item.check - 1]?.pieceId?.split("-")[0] == "R") {
                        if (place[item.push - 1].pieceId == null) {
                            let data = {
                                position: p,
                                check: item.check,
                                push: item.push
                            }
                            arr.push(data);
                        }
                    }
                });
            }
            if (placeMapping[p]) {
                placeMapping[p].forEach((index: any) => {
                    if (!place[index - 1].pieceId) {
                        let data = {
                            position: p,
                            check: 0,
                            push: index
                        }
                        arr.push(data);
                    }
                });
            }
            return arr;
        } else {
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
            let resultMapping: any = {
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
            if (placeMapping[p]) {
                resultMapping[p].forEach((item: any) => {
                    if (place[item.check - 1]?.pieceId?.split("-")[0] == "R") {
                        if (place[item.push - 1].pieceId == null) {
                            let data = {
                                position: p,
                                check: item.check,
                                push: item.push
                            }
                            arr.push(data);
                        }
                    }
                });
            }
            if (placeMapping[p]) {
                placeMapping[p].forEach((index: any) => {
                    if (!place[index - 1].pieceId) {
                        let data = {
                            position: p,
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

const checkvalidPosition = async (data: any, tableData: any) => {
    try {
        logger.info(`START checkBestPositionIsValidOrNot :::: DATA IS :::: POSITION :::: ${JSON.stringify(data)}`)
        let { position, check, push } = data

        let checkValidOrNot: any = [];
        let bestPositions: any = [1, 3, 5, 7, 16, 17, 32, 33, 48, 49, 58, 60, 62, 64];

        for (let i = 0; i < bestPositions.length; i++) {
            if (bestPositions[i] == push) {
                data = {
                    safePlace: true,
                    result: true
                }
                checkValidOrNot.push(data)
            }
        }

        let checkKill: any = {
            10: [{ check: 19, move: 1 }],
            12: [{ check: 19, move: 5 }, { check: 21, move: 3 }],
            14: [{ check: 21, move: 7 }, { check: 23, move: 5 }],
            19: [{ check: 26, move: 12 }, { check: 28, move: 10 }],
            21: [{ check: 28, move: 14 }, { check: 30, move: 12 }],
            23: [{ check: 30, move: 16 }, { check: 32, move: 14 }],
            26: [{ check: 33, move: 19 }, { check: 35, move: 17 }],
            28: [{ check: 35, move: 21 }, { check: 37, move: 19 }],
            30: [{ check: 37, move: 23 }, { check: 39, move: 21 }],
            35: [{ check: 42, move: 28 }, { check: 44, move: 26 }],
            37: [{ check: 44, move: 30 }, { check: 46, move: 28 }],
            39: [{ check: 46, move: 32 }, { check: 48, move: 30 }],
            42: [{ check: 49, move: 35 }, { check: 51, move: 33 }],
            44: [{ check: 51, move: 37 }, { check: 53, move: 35 }],
            46: [{ check: 53, move: 39 }, { check: 55, move: 37 }],
            51: [{ check: 58, move: 44 }, { check: 60, move: 42 }],
            53: [{ check: 60, move: 46 }, { check: 62, move: 44 }],
            55: [{ check: 62, move: 48 }, { check: 64, move: 46 }],
        }
        if (!data.safePlace) {
            if (checkKill[push]) {
                let currentCheckKillData = checkKill[push]
                if (currentCheckKillData) {
                    if (currentCheckKillData.length == 1) {
                        if (tableData[currentCheckKillData[0].check - 1].pieceId !== null) {
                            if (tableData[currentCheckKillData[0].check - 1].pieceId.split('-')[0] == "R" || tableData[currentCheckKillData[0].check - 1].pieceId == "R-king") {
                                console.log("checkKill length is 1 and is Valid False when position is :::: ", position, check, push)
                                data = {
                                    safePlace: false,
                                    result: false
                                }
                                checkValidOrNot.push(false)
                            } else {
                                console.log("checkKill length is 1 and is Valid true when position is :::: ", position, check, push)
                                data = {
                                    safePlace: false,
                                    result: true
                                }
                                checkValidOrNot.push(data)
                            }
                        } else {
                            data = {
                                safePlace: false,
                                result: true
                            }
                            checkValidOrNot.push(data)
                        }
                    } else {
                        if (tableData[currentCheckKillData[0].check - 1].pieceId !== null) {
                            if (tableData[currentCheckKillData[0].check - 1].pieceId.split('-')[0] == "R" || tableData[currentCheckKillData[0].check - 1].pieceId == "R-king") {
                                if (currentCheckKillData[0].move == check) {
                                    console.log("checkKill length is 2 and this is 0 and is Valid False when position is :::: ", position, check, push)
                                    data = {
                                        safePlace: false,
                                        result: false
                                    }
                                    checkValidOrNot.push(false)
                                } else {
                                    console.log("checkKill length is 2 and this is 0 and is Valid true when position is :::: ", position, check, push)
                                    data = {
                                        safePlace: false,
                                        result: true
                                    }
                                    checkValidOrNot.push(data)
                                }
                            }
                        } else {
                            data = {
                                safePlace: false,
                                result: true
                            }
                            checkValidOrNot.push(data)
                        }
                        if (tableData[currentCheckKillData[1].check - 1].pieceId !== null) {
                            console.log("This is inside Of length 2 and 1")
                            if (tableData[currentCheckKillData[1].check - 1].pieceId.split('-')[0] == "R" || tableData[currentCheckKillData[1].check - 1].pieceId == "R-king") {
                                if (currentCheckKillData[1].move == check) {
                                    console.log("checkKill length is 2 and this is 1. and is Valid False when position is :::: ", position, check, push)
                                    data = {
                                        safePlace: false,
                                        result: false
                                    }
                                    checkValidOrNot.push(false)
                                } else {
                                    console.log("checkKill length is 2 and this is 1. and is Valid true when position is :::: ", position, check, push)
                                    data = {
                                        safePlace: false,
                                        result: true
                                    }
                                    checkValidOrNot.push(data)
                                }
                            }
                        } else {
                            data = {
                                safePlace: false,
                                result: true
                            }
                            checkValidOrNot.push(data)
                        }
                    }
                }
            }
        }

        if (checkValidOrNot.length > 0) {
            if (checkValidOrNot.length == 1 && checkValidOrNot[0].safePlace === true) {
                return true
            } else if (checkValidOrNot.length == 1 && checkValidOrNot[0].safePlace === false && checkValidOrNot[0].result === true) {
                return true
            } else if (checkValidOrNot.length == 1 && checkValidOrNot[0].safePlace === false && checkValidOrNot[0].result === false) {
                return false
            } else if (checkValidOrNot.length == 2 && checkValidOrNot[0].safePlace === false && checkValidOrNot[1].result === false) {
                return false
            } else if (checkValidOrNot.length == 2 && checkValidOrNot[0].safePlace === false && checkValidOrNot[0].result === true && checkValidOrNot[1].result === false) {
                return false
            } else if (checkValidOrNot.length == 2 && checkValidOrNot[0].safePlace === false && checkValidOrNot[0].result === false && checkValidOrNot[1].result === true) {
                return false
            } else if (checkValidOrNot.length == 2 && checkValidOrNot[0].safePlace === false && checkValidOrNot[0].result === true && checkValidOrNot[1].result === true) {
                return true
            } else if (checkValidOrNot.length == 2 && checkValidOrNot[0].safePlace === false && checkValidOrNot[0].result === false && checkValidOrNot[1].result === false) {
                return false
            }
        }
    } catch (error) {
        logger.error(`CATCH_ERROR checkBestPositionIsValidOrNot :::: ${error}`)
    }
}


export { checkPosition, checkBestPosition, checkvalidPosition }