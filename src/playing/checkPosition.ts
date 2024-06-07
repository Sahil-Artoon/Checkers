import { logger } from "../logger"

const checkPosition = (p: any, place: any, color: any) => {
    try {
        logger.info(`START checkPosition :::: Position : ${p} AND Place : ${place}`)
        if (color == 'red') {
            const placeMapping: any = {
                1: [],
                3: [],
                5: [],
                7: [],
                10: [1, 3],
                12: [3, 5],
                14: [5, 7],
                16: [7],
                17: [10],
                19: [10, 12],
                21: [12, 14],
                23: [14, 16],
                26: [17, 19],
                28: [19, 21],
                30: [21, 23],
                32: [23],
                33: [26],
                35: [26, 28],
                37: [28, 30],
                39: [30, 32],
                42: [33, 35],
                44: [35, 37],
                46: [37, 39],
                48: [39],
                49: [42],
                51: [42, 44],
                53: [44, 46],
                55: [46, 48],
                58: [49, 51],
                60: [51, 53],
                62: [53, 55],
                64: [55]
            };

            let arr = [];
            if (placeMapping[p]) {
                console.log('placeMapping[p]', placeMapping[p]);
                for (let index of placeMapping[p]) {
                    console.log("Index:::", index - 1)
                    console.log("placeMapping", placeMapping[p])
                    console.log("PLACE OF INDEX", place[index - 1])
                    if (place[index - 1].pieceId == null) {
                        console.log("Inside ::::")
                        console.log(index)
                        arr.push(index);
                    }
                }
            }
            return arr;
        }
        if (color == 'black') {
            const placeMapping: any = {
                1: [10],
                3: [10, 12],
                5: [12, 14],
                7: [14, 16],
                10: [17, 19],
                12: [19, 21],
                14: [23, 21],
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
                55: [64],
                58: [],
                60: [],
                62: [],
                64: []
            };

            let arr = [];
            if (placeMapping[p]) {
                console.log('placeMapping[p]', placeMapping[p]);
                for (let index of placeMapping[p]) {
                    console.log("Index:::", index - 1)
                    console.log("placeMapping", placeMapping[p])
                    console.log("PLACE OF INDEX", place[index - 1])
                    if (place[index - 1].pieceId == null) {
                        console.log("Inside ::::")
                        console.log(index)
                        arr.push(index);
                    }
                }
            }
            return arr;
        }
    } catch (error) {
        logger.error(`CATCH_ERROR checkPosition :::: ${error}`)
    }
}
export { checkPosition }