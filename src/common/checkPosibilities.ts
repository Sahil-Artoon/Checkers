import { logger } from "../logger";

const checkPosibilities = async (table: any, currentUser: any) => {
    try {
        logger.info(`START checkPosibilities :::: DATA :::: ${currentUser}`)
        if (table) {
            if (table.playerInfo[0].userId == currentUser) {
                if (table.playerInfo[0].color == "red") {
                    let allPositions: any = [];
                    table.tableData.forEach(async (item: any) => {
                        if (item.pieceId && item.pieceId != null) {
                            if (item.pieceId.split('-')[0] == "R" || item.pieceId == "R-king") {
                                allPositions.push(item.place)
                            }
                        }
                    })
                    return allPositions;
                } else if (table.playerInfo[0].color == "black") {
                    let allPositions: any = [];
                    table.tableData.forEach(async (item: any) => {
                        if (item.pieceId && item.pieceId != null) {
                            if (item.pieceId.split('-')[0] == "B" || item.pieceId == "B-king") {
                                allPositions.push(item.place)
                            }
                        }
                    })
                    return allPositions;
                }

            } else if (table.playerInfo[1].userId == currentUser) {
                if (table.playerInfo[1].color == "red") {
                    let allPositions: any = [];
                    table.tableData.forEach(async (item: any) => {
                        if (item.pieceId && item.pieceId != null) {
                            if (item.pieceId.split('-')[0] == "R" || item.pieceId == "R-king") {
                                allPositions.push(item.place)
                            }
                        }
                    })
                    return allPositions;
                } else if (table.playerInfo[1].color == "black") {
                    let allPositions: any = [];
                    table.tableData.forEach(async (item: any) => {
                        if (item.pieceId && item.pieceId != null) {
                            if (item.pieceId.split('-')[0] == "B" || item.pieceId == "B-king") {
                                allPositions.push(item.place)
                            }
                        }
                    })
                    return allPositions;
                }

            }
        }
    } catch (error) {
        logger.error(`CATCH_ERROR checkPosibilities :::: ${error}`)
    }
}

export { checkPosibilities }