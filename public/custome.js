const socket = io();
let userId;
let userName;
let color;
let positonOfClickPiece;
let tableId;
let dataOfPlay
function setUserSession(key, value, expire) {
    const now = new Date().getTime();
    const expirationTime = now + expire * 60 * 1000;
    sessionStorage.setItem(key, JSON.stringify(value), expirationTime);
}
function getSession(key) {
    const value = sessionStorage.getItem(key);
    return value ? JSON.parse(value) : null;
}

document.getElementById('join-table-form').addEventListener('submit', (event) => {
    event.preventDefault();
    let userName = document.getElementById('userName').value
    document.getElementById('userName').value = ''
    if (userName == "") return alert("Please enter Valid UserName")
    data = {
        eventName: "SIGN_UP",
        data: {
            userName,
            isBot: false
        }
    }
    sendEmmiter(data)
    return;
})

document.getElementById('play-with-bot').addEventListener('click', (event) => {
    event.preventDefault();
    let User = getSession('USER');
    console.log("User :::: ", User)
    data = {
        eventName: "JOIN_TABLE",
        data: {
            _id: User._id,
            userName: User.userName,
            isBot: User.isBot,
            playWithBot: true
        }
    }
    sendEmmiter(data);
    return;
})

document.getElementById('play-with-player').addEventListener('click', (event) => {
    event.preventDefault();
    let User = getSession('USER');
    data = {
        eventName: "JOIN_TABLE",
        data: {
            _id: User._id,
            userName: User.userName,
            isBot: User.isBot,
            playWithBot: false
        }
    }
    sendEmmiter(data);
    return;
    // document.getElementById('section-2').style.display = "none"
    // document.getElementById('section-3').style.display = "block"
})

const elements = document.querySelectorAll('.wood-dark');
let currentColor;
elements.forEach((element) => {
    element.style.backgroundColor = '#8b4513';
    const img = element.querySelector('img');
    if (img) {
        img.style.opacity = 1;
    }
});

function handleClick(event) {
    event.preventDefault();
    elements.forEach((el) => {
        el.style.backgroundColor = '#8b4513';
        el.style.opacity = 1;
    });

    const element = event.currentTarget;

    const img = element.querySelector('img');
    if (img) {
        let imgColor = img.id
        let parts = imgColor.split("-");
        let typeOfColor = parts[0];
        if (typeOfColor == 'R') {
            currentColor = 'red'
        }
        if (typeOfColor == 'B') {
            currentColor = 'black'
        }
        console.log("This is typeOfColor ::::")
        console.log(typeOfColor)
        console.log("This is Current Color ")
        console.log(currentColor)
        console.log("THis is color :::: ")
        console.log(color)
    }
    if (currentColor == color) {
        for (let i = 0; i < element.classList.length; i++) {
            if (element.classList[i] == 'selected') {
                element.classList.remove('selected');
                data = {
                    eventName: "MOVE",
                    data: {
                        tableId,
                        userId,
                        movePosition: element.id,
                        movePiece: positonOfClickPiece,
                        dataOfPlay
                    }
                }
                sendEmmiter(data)
                return;
            }
        }
        if (img) {
            console.log("::::::::::: This is ElementId :::::::::::")
            console.log(element.id);
            console.log("::::::::::: This is Element :::::::::::")
            console.log(element);
            console.log("::::::::::: This is IMGID :::::::::::")
            console.log(img.id);

            const User = getSession('USER_TABLE');
            const data = {
                eventName: "PLAY",
                data: {
                    userId: User.userId,
                    tableId: User.tableId,
                    userName: User.userName,
                    isBot: User.isBot,
                    position: element.id
                }
            };
            sendEmmiter(data);
        }
    }
}

elements.forEach((element) => {
    element.addEventListener('click', handleClick);
});

const leaveGame = () => {
    console.log("Leave Game :::::::::::");
    let data = {
        eventName: "LEAVE_GAME",
        data: {
            userId,
            tableId
        }
    }
    sendEmmiter(data)
}
// :::::::::::: SOCKET ON FUNCTIONS ::::::::::::
const popUp = (data) => {
    console.log(`popUp :::: DATA :::: ${JSON.stringify(data)}`)
    alert(data.message)
}
const signUp = (data) => {
    console.log(`signUp :::: DATA :::: ${JSON.stringify(data)}`)
    if (data.message == "ok") {
        userId = data.User._id
        userName = data.User.userName
        data = {
            _id: data.User._id,
            userName: data.User.userName,
            isBot: data.User.isBot
        }
        setUserSession("USER", data, 60)
        document.getElementById('section-1').style.display = "none"
        document.getElementById('section-2').style.display = "block"
    } else {
        alert(data.message)
    }
}

const joinTable = (data) => {
    console.log(`joinTable :::: DATA :::: ${JSON.stringify(data)}`)
    if (data.message == "ok") {
        tableId = data.tableId
        console.log("Data.message", data.message)
        console.log("data.playerData.length :::", data.playerData.length)
        let tableData = data.tableData
        let ele = document.getElementsByClassName("cell")
        for (let i = 0; i < tableData.length; i++) {
            if (tableData[i].pieceId) {
                if (tableData[i].pieceId != null) {
                    if (tableData[i].pieceId.split('-')[0] == "R" && tableData[i].pieceId.split('-')[1] != "king") {
                        let img = document.createElement('img')
                        img.src = 'image/red.png';
                        img.alt = 'red-piece';
                        img.className = 'piece red-piece';
                        img.id = tableData[i].pieceId;
                        ele[i].appendChild(img);
                    }
                    if (tableData[i].pieceId.split('-')[0] == "B" && tableData[i].pieceId.split('-')[1] != "king") {
                        let img = document.createElement('img')
                        img.src = 'image/black.png';
                        img.alt = 'black-piece';
                        img.className = 'piece black-piece';
                        img.id = tableData[i].pieceId;
                        ele[i].appendChild(img);
                    }
                    if (tableData[i].pieceId == "B-king") {
                        let img = document.createElement('img')
                        img.src = 'image/black_king.png';
                        img.alt = 'black-piece';
                        img.className = 'piece black-piece';
                        img.id = tableData[i].pieceId;
                        ele[i].appendChild(img);
                    }
                    if (tableData[i].pieceId == "R-king") {
                        let img = document.createElement('img')
                        img.src = 'image/red_king.png';
                        img.alt = 'black-piece';
                        img.className = 'piece black-piece';
                        img.id = tableData[i].pieceId;
                        ele[i].appendChild(img);
                    }
                }
            }
        }
        if (data.playerData.length == 1) {
            if (data.playerData[0].userId == userId) {
                console.log("This is Inside userId match ::::")
                color = data.playerData[0].color
                data = {
                    tableId: data.tableId,
                    userId: data.playerData[0].userId,
                    userName: data.playerData[0].userName,
                    isBot: data.playerData[0].isBot,
                    color: data.playerData[0].color
                }
                setUserSession("USER_TABLE", data, 60)
                document.getElementById('section-2').style.display = "none"
                document.getElementById('section-3').style.display = "block"
                document.getElementById('section-4').style.display = "block"
                document.getElementById('time').innerHTML = 'Waiting for Apponet Player'
            }
        } else {
            if (data.playerData[1].userId == userId) {
                color = data.playerData[1].color
                data = {
                    tableId: data.tableId,
                    userId: data.playerData[1].userId,
                    userName: data.playerData[1].userName,
                    isBot: data.playerData[1].isBot,
                    color: data.playerData[1].color
                }
                setUserSession("USER_TABLE", data, 60)
            }
            document.getElementById('section-2').style.display = "none"
            document.getElementById('section-3').style.display = "block"
            document.getElementById('main-board').style.transform = "rotate(180deg)"
            document.getElementById('section-5').style.transform = "rotate(180deg)"
            document.getElementById('section-4').style.display = "block"
            document.getElementById('time').innerHTML = 'Waiting for Apponet Player'
        }
    }
}

const roundTimer = (data) => {
    console.log(`roundTimer :::: DATA :::: ${JSON.stringify(data)}`)
    if (data.message == "ok") {
        document.getElementById('time').innerHTML = 'Round Timer Started'
    }
}

const lockTable = (data) => {
    console.log(`lockTable :::: DATA :::: ${JSON.stringify(data)}`)
    if (data.message == "ok") {
        document.getElementById('time').innerHTML = 'Lock Table'
        document.getElementById('leaveButton').style.display = 'none'
    }
}

const turn = (data) => {
    console.log(`turn :::: DATA :::: ${JSON.stringify(data)}`)
    let User = getSession('USER');
    console.log("User", User)
    console.log("UserId", data.userId)
    document.getElementById('leaveButton').style.display = 'block'
    if (User._id == data.userId) {
        document.getElementById('section-4').style.display = 'none'
        // document.getElementById('section-5').style.display = 'block'
        // document.getElementById('section-6').style.display = 'block'
    } else {
        document.getElementById('section-4').style.display = 'none'
        // document.getElementById('section-5').style.display = 'block'
        // document.getElementById('section-6').style.display = 'block'
    }
}

const changeTurn = (data) => {
    console.log(`changeTurn :::: DATA :::: ${JSON.stringify(data)}`)
}

const printPlace = (data) => {
    console.log(`printPlace :::: DATA :::: ${JSON.stringify(data)}`)
    if (data.message == "ok") {
        User = getSession('USER')
        if (data.userId == User._id) {
            console.log("data", data)
            document.getElementById(`${data.position}`).style.opacity = 0.7;
            positonOfClickPiece = data.position
            dataOfPlay = data.sendPosition
            for (let i = 0; i < data.sendPosition.length; i++) {
                document.getElementById(`D-${data.sendPosition[i].push}`).classList.add("selected");
                document.getElementById(`D-${data.sendPosition[i].push}`).style.backgroundColor = '#0080009e'
            }
        }
    }
}

const move = (data) => {
    console.log(`move :::: DATA :::: ${JSON.stringify(data)}`)
    if (data.message == "ok") {
        console.log("DATA OF removePiece PIECE :::: ", data.removePiece)
        console.log("DATA OF emptyBoxId PIECE :::: ", data.emptyBoxId)
        console.log("DATA OF REMOVE addBoxId :::: ", data.addBoxId)
        console.log("DATA OF blackTotalKill :::: ", data.blackTotalKill)
        console.log("DATA OF redTotalKill :::: ", data.redTotalKill)
        document.getElementById('redTotalKill').innerHTML = `${data.redTotalKill}`
        document.getElementById('blackTotalKill').innerHTML = `${data.blackTotalKill}`
        if (data.removePiece) {
            let findEle = document.getElementById(`D-${data.removePiece}`)
            if (findEle == null) {
                findEle = document.getElementById(`redKing-${data.removePiece}`)
                if (findEle == null) {
                    findEle = document.getElementById(`blackKing-${data.removePiece}`)
                }
            }
            let img = findEle.querySelector(`img`)
            findEle.removeChild(img)
            findEle.removeAttribute('id')
            findEle.id = `D-${data.removePiece}`
        }


        let checkColor;
        let numberOfBoxes = data.emptyBoxId.split("-")[1]
        let addBoxId = data.addBoxId.split("-")[1]
        let ELE = document.getElementById(`D-${numberOfBoxes}`)
        if (ELE == null) {
            ELE = document.getElementById(`redKing-${numberOfBoxes}`)
            if (ELE == null) {
                ELE = document.getElementById(`blackKing-${numberOfBoxes}`)
            }
        }
        console.log("This is ELE ::::: ", ELE)
        console.log("This is ELE Id :::: ", ELE.id)

        checkColor = ELE.id.split("-")[0]
        console.log("This is checkColor :::: ", checkColor)
        let imgOfEmptyBox = ELE.querySelector("img")
        console.log("This is imgOf EmptyBox :::: ", imgOfEmptyBox)

        let ELEOfAddBox = document.getElementById(`D-${addBoxId}`)
        ELEOfAddBox.removeAttribute("id")
        ELEOfAddBox.id = `${checkColor}-${addBoxId}`
        ELEOfAddBox.appendChild(imgOfEmptyBox)

        ELE.removeAttribute("id")
        ELE.id = `D-${numberOfBoxes}`
        
    }
}

const king = (data) => {
    console.log(`king :::: DATA :::: ${JSON.stringify(data)}`)
    if (data.message == "ok") {
        let getEle = document.getElementById(`D-${data.numberOfBox}`)
        console.log('This is getEle::::::', getEle)
        if (data.colorOfKing == "black") {
            getEle.querySelector('img').src = 'image/black_king.png'
            getEle.removeAttribute('id')
            getEle.id = `blackKing-${data.numberOfBox}`
        }
        if (data.colorOfKing == "red") {
            getEle.querySelector('img').src = 'image/red_king.png'
            getEle.removeAttribute('id')
            getEle.id = `redKing-${data.numberOfBox}`
        }
    }
}

const winner = (data) => {
    console.log(`winner :::: DATA ${JSON.stringify(data)}`)
    if (data.message == "ok") {
        document.getElementById('section-4').style.display = "block"
        if (data.userId == userId) {
            document.getElementById('time').innerHTML = `You Win ${userName}`
        } else if (data.userId != userId) {
            document.getElementById('time').innerHTML = `You Lose ${userName}`
        }
        if (data.tie) {
            document.getElementById('time').innerHTML = "IT'S TIE"
        }
    }
}

const reStart = (data) => {
    console.log(`reStart :::: DATA ${JSON.stringify(data)}`)
    if (data.message == "ok") {
        sessionStorage.removeItem('USER_TABLE');
        window.location.reload()
    }
}

const reJoin = (data) => {
    console.log(`reJoin :::: DATA ${JSON.stringify(data)}`)
    if (data.message == "ok") {
        // This is For Wating
        if (data.gameStatus == "WAITING") {
            if (data.tableDelete == true) {
                sessionStorage.removeItem('USER_TABLE');
                window.location.reload()
            }
        }

        // This is for Round_timer
        if (data.gameStatus == 'ROUND_TIMER') {
            console.log("THis is inside rejoin ROUND_TIMER")
            let tableData = data.tableData
            let ele = document.getElementsByClassName("cell")
            for (let i = 0; i < tableData.length; i++) {
                if (tableData[i].pieceId) {
                    if (tableData[i].pieceId != null) {
                        if (tableData[i].pieceId.split('-')[0] == "R") {
                            let img = document.createElement('img')
                            img.src = 'image/red.png';
                            img.alt = 'red-piece';
                            img.className = 'piece red-piece';
                            img.id = tableData[i].pieceId;
                            ele[i].appendChild(img);
                        }
                        if (tableData[i].pieceId.split('-')[0] == "B") {
                            let img = document.createElement('img')
                            img.src = 'image/black.png';
                            img.alt = 'black-piece';
                            img.className = 'piece black-piece';
                            img.id = tableData[i].pieceId;
                            ele[i].appendChild(img);
                        }
                    }
                }
            }
            if (data.playerInfo[0].userId == data.userId) {
                tableId = data.tableId
                userId = data.playerInfo[0].userId
                userName = data.playerInfo[0].userName
                color = data.playerInfo[0].color
                document.getElementById('section-1').style.display = "none"
                document.getElementById('section-2').style.display = "none"
                document.getElementById('section-3').style.display = "block"
                document.getElementById('section-4').style.display = "block"
                document.getElementById('time').innerHTML = 'Round Timer Started'
            }
            if (data.playerInfo[1].userId == data.userId) {
                tableId = data.tableId
                userId = data.playerInfo[1].userId
                userName = data.playerInfo[1].userName
                color = data.playerInfo[1].color
                document.getElementById('section-1').style.display = "none"
                document.getElementById('section-2').style.display = "none"
                document.getElementById('section-3').style.display = "block"
                document.getElementById('main-board').style.transform = "rotate(180deg)"
                document.getElementById('section-5').style.transform = "rotate(180deg)"
                document.getElementById('section-4').style.display = "block"
                document.getElementById('time').innerHTML = 'Round Timer Started'
            }
        }

        // This is for Lock_Table
        if (data.gameStatus == 'LOCK_TABLE') {
            console.log("THis is inside rejoin LOCK_TABLE")
            let tableData = data.tableData
            let ele = document.getElementsByClassName("cell")
            document.getElementById('leaveButton').style.display = 'none'
            for (let i = 0; i < tableData.length; i++) {
                if (tableData[i].pieceId) {
                    if (tableData[i].pieceId != null) {
                        if (tableData[i].pieceId.split('-')[0] == "R") {
                            let img = document.createElement('img')
                            img.src = 'image/red.png';
                            img.alt = 'red-piece';
                            img.className = 'piece red-piece';
                            img.id = tableData[i].pieceId;
                            ele[i].appendChild(img);
                        }
                        if (tableData[i].pieceId.split('-')[0] == "B") {
                            let img = document.createElement('img')
                            img.src = 'image/black.png';
                            img.alt = 'black-piece';
                            img.className = 'piece black-piece';
                            img.id = tableData[i].pieceId;
                            ele[i].appendChild(img);
                        }
                    }
                }
            }
            if (data.playerInfo[0].userId == data.userId) {
                tableId = data.tableId
                userId = data.playerInfo[0].userId
                userName = data.playerInfo[0].userName
                color = data.playerInfo[0].color
                document.getElementById('section-1').style.display = "none"
                document.getElementById('section-2').style.display = "none"
                document.getElementById('section-3').style.display = "block"
                document.getElementById('section-4').style.display = "block"
                document.getElementById('time').innerHTML = 'Lock Table'
            }
            if (data.playerInfo[1].userId == data.userId) {
                tableId = data.tableId
                userId = data.playerInfo[1].userId
                userName = data.playerInfo[1].userName
                color = data.playerInfo[1].color
                document.getElementById('section-1').style.display = "none"
                document.getElementById('section-2').style.display = "none"
                document.getElementById('section-3').style.display = "block"
                document.getElementById('main-board').style.transform = "rotate(180deg)"
                document.getElementById('section-5').style.transform = "rotate(180deg)"
                document.getElementById('section-4').style.display = "block"
                document.getElementById('time').innerHTML = 'Lock Table'
            }
        }

        // This is for PLAYING
        if (data.gameStatus == "PLAYING") {
            console.log("THis is inside rejoin LOCK_TABLE")
            document.getElementById('redTotalKill').innerHTML = `${data.table.redTotalLose}`
            document.getElementById('blackTotalKill').innerHTML = `${data.table.blackTotalLose}`
            let tableData = data.table.tableData
            let ele = document.getElementsByClassName("cell")
            for (let i = 0; i < tableData.length; i++) {
                if (tableData[i].pieceId) {
                    if (tableData[i].pieceId != null) {
                        if (tableData[i].pieceId.split('-')[0] == "R") {
                            if (tableData[i].pieceId.split('-')[1] == "king") {
                                let img = document.createElement('img')
                                img.src = 'image/red_king.png';
                                img.alt = 'red-piece';
                                img.className = 'piece red-piece';
                                img.id = tableData[i].pieceId;
                                ele[i].appendChild(img);
                            } else {
                                let img = document.createElement('img')
                                img.src = 'image/red.png';
                                img.alt = 'red-piece';
                                img.className = 'piece red-piece';
                                img.id = tableData[i].pieceId;
                                ele[i].appendChild(img);
                            }
                        }
                        if (tableData[i].pieceId.split('-')[0] == "B") {
                            if (tableData[i].pieceId.split('-')[1] == "king") {
                                let img = document.createElement('img')
                                img.src = 'image/black_king.png';
                                img.alt = 'black-piece';
                                img.className = 'piece black-piece';
                                img.id = tableData[i].pieceId;
                                ele[i].appendChild(img);
                            } else {
                                let img = document.createElement('img')
                                img.src = 'image/black.png';
                                img.alt = 'black-piece';
                                img.className = 'piece black-piece';
                                img.id = tableData[i].pieceId;
                                ele[i].appendChild(img);
                            }
                        }
                    }
                }
            }
            if (data.table.playerInfo[0].userId == data.userId) {
                tableId = data.tableId
                userId = data.table.playerInfo[0].userId
                userName = data.table.playerInfo[0].userName
                color = data.table.playerInfo[0].color
                document.getElementById('section-1').style.display = "none"
                document.getElementById('section-2').style.display = "none"
                document.getElementById('section-3').style.display = "block"
                document.getElementById('section-4').style.display = "none"
            }
            if (data.table.playerInfo[1].userId == data.userId) {
                tableId = data.tableId
                userId = data.table.playerInfo[1].userId
                userName = data.table.playerInfo[1].userName
                color = data.table.playerInfo[1].color
                document.getElementById('section-1').style.display = "none"
                document.getElementById('section-2').style.display = "none"
                document.getElementById('section-3').style.display = "block"
                document.getElementById('main-board').style.transform = "rotate(180deg)"
                document.getElementById('section-5').style.transform = "rotate(180deg)"
                document.getElementById('section-4').style.display = "none"
            }
        }

        // This is for WINNER
        if (data.gameStatus == "WINNER" || data.gameStatus == "TIE") {
            console.log("THis is inside rejoin WINNER")
            let tableData = data.table.tableData
            let ele = document.getElementsByClassName("cell")
            for (let i = 0; i < tableData.length; i++) {
                if (tableData[i].pieceId) {
                    if (tableData[i].pieceId != null) {
                        if (tableData[i].pieceId.split('-')[0] == "R") {
                            let img = document.createElement('img')
                            img.src = 'image/red.png';
                            img.alt = 'red-piece';
                            img.className = 'piece red-piece';
                            img.id = tableData[i].pieceId;
                            ele[i].appendChild(img);
                        }
                        if (tableData[i].pieceId.split('-')[0] == "B") {
                            let img = document.createElement('img')
                            img.src = 'image/black.png';
                            img.alt = 'black-piece';
                            img.className = 'piece black-piece';
                            img.id = tableData[i].pieceId;
                            ele[i].appendChild(img);
                        }
                    }
                }
            }
            if (data.table.playerInfo[0].userId == data.userId) {
                tableId = data.tableId
                userId = data.table.playerInfo[0].userId
                userName = data.table.playerInfo[0].userName
                color = data.table.playerInfo[0].color
                document.getElementById('section-1').style.display = "none"
                document.getElementById('section-2').style.display = "none"
                document.getElementById('section-3').style.display = "block"
                document.getElementById('section-4').style.display = "block"
                document.getElementById('time').innerHTML = `You Win ${userName}`
                if (data.tie == true) {
                    document.getElementById('time').innerHTML = "IT'S TIE"
                }
                else {
                    if (data.table.winnerUserId == userId) {
                        document.getElementById('time').innerHTML = `You Win ${userName}`
                    } else {
                        document.getElementById('time').innerHTML = `You Lose ${userName}`
                    }
                }
            }
            if (data.table.playerInfo[1].userId == data.userId) {
                tableId = data.tableId
                userId = data.table.playerInfo[1].userId
                userName = data.table.playerInfo[1].userName
                color = data.table.playerInfo[1].color
                document.getElementById('section-1').style.display = "none"
                document.getElementById('section-2').style.display = "none"
                document.getElementById('section-3').style.display = "block"
                document.getElementById('main-board').style.transform = "rotate(180deg)"
                document.getElementById('section-5').style.transform = "rotate(180deg)"
                document.getElementById('section-4').style.display = "block"
                document.getElementById('time').innerHTML = `You Win ${userName}`
                if (data.tie == true) {
                    document.getElementById('time').innerHTML = "IT'S TIE"
                }
                else {
                    if (data.table.winnerUserId == userId) {
                        document.getElementById('time').innerHTML = `You Win ${userName}`
                    } else {
                        document.getElementById('time').innerHTML = `You Lose ${userName}`
                    }
                }
            }
        }
    }
}

const leave = (data) => {
    console.log(`Leave :::: ${JSON.stringify(data)}`)
    if (data.message == "ok") {
        if (data.gameStatus == "WAITING") {
            sessionStorage.removeItem('USER_TABLE')
            window.location.reload()
        }

        if (data.gameStatus == "ROUND_TIMER") {
            if (data.userId == userId) {
                sessionStorage.removeItem('USER_TABLE')
                window.location.reload()
            } else {
                document.getElementById('time').innerHTML = `Waiting for Apponet Player`
            }
        }

        if (data.gameStatus == "PLAYING") {
            if (data.userId == userId) {
                sessionStorage.removeItem('USER_TABLE')
                window.location.reload()
            }
            if (data.userId != userId) {
                document.getElementById('section-4').style.display = "block";
                document.getElementById('time').innerHTML = `${userName} You WIN`;
            }
        }
    }
}

const sendEmmiter = (data) => {
    console.log(`EventName IS ::: ${data.eventName} and Data is ${JSON.stringify(data.data)}`)
    socket.emit(data.eventName, data.data)
}

socket.onAny((eventName, data) => {
    console.log(`EventName IS::: ${eventName} and Data is ${JSON.stringify(data)}`)
    switch (eventName) {
        case "POP_UP":
            popUp(data)
            break;

        case "SIGN_UP":
            signUp(data)
            break;

        case "JOIN_TABLE":
            joinTable(data)
            break;

        case "ROUND_TIMER":
            roundTimer(data)
            break;

        case "LOCK_TABLE":
            lockTable(data)
            break;

        case "TURN":
            turn(data)
            break;

        case "CHANGE_TURN":
            changeTurn(data)
            break;

        case "SEND_PLACE":
            printPlace(data)
            break;

        case "MOVE":
            move(data)
            break;

        case "KING":
            king(data)
            break;

        case "WINNER":
            winner(data)
            break;

        case "RE_START":
            reStart(data)
            break;

        case "RE_JOIN":
            reJoin(data)
            break;

        case "LEAVE_GAME":
            leave(data)
            break;
    }
})

let findTable = getSession('USER_TABLE')
if (findTable) {
    let data = {
        eventName: 'RE_JOIN',
        data: {
            tableId: findTable.tableId,
            userId: findTable.userId
        }
    }
    sendEmmiter(data)
} else {
    let findUser = getSession('USER')
    if (findUser) {
        userId = findUser._id
        userName = findUser.userName
        document.getElementById('section-1').style.display = "none"
        document.getElementById('section-2').style.display = "block"
    }
}