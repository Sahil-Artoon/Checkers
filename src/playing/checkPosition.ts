import { logger } from "../logger"

const checkPosition = (p: any, place: any, color: any, isBot: boolean) => {
    try {
        logger.info(`START checkPosition :::: Position : ${p} AND Place : ${place} And Color : ${color} And isBot : ${isBot}`)
        if (color == 'red') {
            console.log("This is Inside color red")
            const placeMapping: any = {
                1: [], 3: [], 5: [], 7: [], 10: [1, 3], 12: [3, 5], 14: [5, 7], 16: [7],
                17: [10], 19: [10, 12], 21: [12, 14], 23: [14, 16], 26: [17, 19], 28: [19, 21],
                30: [21, 23], 32: [23], 33: [26], 35: [26, 28], 37: [28, 30], 39: [30, 32],
                42: [33, 35], 44: [35, 37], 46: [37, 39], 48: [39], 49: [42], 51: [42, 44],
                53: [44, 46], 55: [46, 48], 58: [49, 51], 60: [51, 53], 62: [53, 55], 64: [55]
            };
            const pieceCheckMapping: any = {
                64: [{ check: 55, push: 46 }],
                62: [{ check: 53, push: 44 }, { check: 55, push: 48 }],
                60: [{ check: 51, push: 42 }, { check: 53, push: 46 }],
                58: [{ check: 51, push: 44 }],
                55: [{ check: 46, push: 37 }],
                53: [{ check: 46, push: 39 }, { check: 44, push: 35 }],
                51: [{ check: 44, push: 37 }, { check: 42, push: 33 }],
                49: [{ check: 42, push: 35 }],
                48: [{ check: 39, push: 30 }],
                46: [{ check: 39, push: 32 }, { check: 37, push: 28 }],
                44: [{ check: 37, push: 30 }, { check: 35, push: 26 }],
                42: [{ check: 35, push: 28 }],
                39: [{ check: 30, push: 21 }],
                37: [{ check: 30, push: 23 }, { check: 28, push: 19 }],
                35: [{ check: 28, push: 21 }, { check: 26, push: 17 }],
                33: [{ check: 26, push: 19 }],
                32: [{ check: 23, push: 14 }],
                30: [{ check: 23, push: 16 }, { check: 21, push: 12 }],
                28: [{ check: 21, push: 14 }, { check: 19, push: 10 }],
                26: [{ check: 19, push: 12 }],
                23: [{ check: 14, push: 5 }],
                21: [{ check: 14, push: 7 }, { check: 12, push: 3 }],
                19: [{ check: 12, push: 5 }, { check: 10, push: 1 }],
                17: [{ check: 10, push: 3 }],
                16: [],
                14: [],
                12: [],
                10: [],
                7: [],
                5: [],
                3: [],
                1: []
            };
            let arr: any = [];
            if (pieceCheckMapping[p]) {
                pieceCheckMapping[p].forEach((item: any) => {
                    if (place[item.check - 1]?.pieceId?.split("-")[0] == "B") {
                        if (place[item.push - 1].pieceId == null) {
                            let data = {
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
                            check: 0,
                            push: index
                        }
                        arr.push(data);
                    }
                });
            }
            return arr;
        }

        if (color == 'black') {
            console.log("This is Inside color Black")
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
            if (placeMapping[p]) {
                resultMapping[p].forEach((item: any) => {
                    if (place[item.check - 1]?.pieceId?.split("-")[0] == "R") {
                        if (place[item.push - 1].pieceId == null) {
                            let data = {
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
                            check: 0,
                            push: index
                        }
                        arr.push(data);
                    }
                });
            }
            return arr;
        }

        if (color == 'redKing') {
            console.log(":::::::::::::::::::::::::::::::::::::::::::::::")
            console.log("This is Inside color redKing")
            console.log(":::::::::::::::::::::::::::::::::::::::::::::::")
            const placeMapping: any = {
                1: [10], 3: [10, 12], 5: [12, 14], 7: [14, 16], 10: [1, 3, 17, 19], 12: [3, 5, 19, 21], 14: [5, 7, 21, 23], 16: [7, 23],
                17: [10, 26], 19: [10, 12, 26, 28], 21: [12, 14, 28, 30], 23: [14, 16, 30, 32], 26: [17, 19, 33, 35], 28: [19, 21, 35, 37],
                30: [21, 23, 37, 39], 32: [23, 39], 33: [26, 42], 35: [26, 28, 42, 44], 37: [28, 30, 44, 46], 39: [30, 32, 46, 48],
                42: [33, 35, 49, 51], 44: [35, 37, 51, 53], 46: [37, 39, 53, 55], 48: [39, 55], 49: [42, 58], 51: [42, 44, 58, 60],
                53: [44, 46, 60, 62], 55: [46, 48, 62, 64], 58: [49, 51], 60: [51, 53], 62: [53, 55], 64: [55]
            };

            const pieceCheckMapping: any = {
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
                12: [{ check: 21, push: 30 }, { check: 19, push: 26 }],
                10: [{ check: 19, push: 28 }],
                7: [{ check: 14, push: 21 }],
                5: [{ check: 14, push: 23 }, { check: 12, push: 19 }],
                3: [{ check: 12, push: 21 }, { check: 10, push: 17 }],
                1: [{ check: 10, push: 19 }]
            };

            let arr: any = [];
            if (pieceCheckMapping[p]) {
                pieceCheckMapping[p].forEach((item: any) => {
                    if (place[item.check - 1]?.pieceId?.split("-")[0] == "B") {
                        if (place[item.push - 1].pieceId == null) {
                            let data = {
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
                            check: 0,
                            push: index
                        }
                        arr.push(data);
                    }
                });
            }
            return arr;
        }

        if (color == 'blackKing') {
            console.log("This is Inside color blackKing")
            const placeMapping: any = {
                1: [10], 3: [10, 12], 5: [12, 14], 7: [14, 16], 10: [1, 3, 17, 19], 12: [3, 5, 19, 21], 14: [5, 7, 21, 23], 16: [7, 23],
                17: [10, 26], 19: [10, 12, 26, 28], 21: [12, 14, 28, 30], 23: [14, 16, 30, 32], 26: [17, 19, 33, 35], 28: [19, 21, 35, 37],
                30: [21, 23, 37, 39], 32: [23, 39], 33: [26, 33], 35: [26, 28, 42, 44], 37: [28, 30, 44, 46], 39: [30, 32, 46, 48],
                42: [33, 35, 49, 51], 44: [35, 37, 51, 53], 46: [37, 39, 53, 55], 48: [39, 55], 49: [42, 58], 51: [42, 44, 58, 60],
                53: [44, 46, 60, 62], 55: [46, 48, 62, 64], 58: [49, 51], 60: [51, 53], 62: [53, 55], 64: [55]
            };

            const pieceCheckMapping: any = {
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

            let arr: any = [];
            if (pieceCheckMapping[p]) {
                pieceCheckMapping[p].forEach((item: any) => {
                    if (place[item.check - 1]?.pieceId?.split("-")[0] == "R") {
                        if (place[item.push - 1].pieceId == null) {
                            let data = {
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
                            check: 0,
                            push: index
                        }
                        arr.push(data);
                    }
                });
            }
            return arr;
        }
    } catch (error) {
        logger.error(`CATCH_ERROR checkPosition :::: ${error}`)
    }
}
export { checkPosition }