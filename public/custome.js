const socket = io();
let userId;
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
// :::::::::::: SOCKET ON FUNCTIONS ::::::::::::
const popUp = (data) => {
    console.log(`popUp :::: DATA :::: ${JSON.stringify(data)}`)
    alert(data.message)
}
const signUp = (data) => {
    console.log(`signUp :::: DATA :::: ${JSON.stringify(data)}`)
    if (data.message == "ok") {
        userId = data.User._id
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
        if (data.playerData.length == 1) {
            if (data.playerData[0].userId == userId) {
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
    }
}

const turn = (data) => {
    console.log(`turn :::: DATA :::: ${JSON.stringify(data)}`)
    let User = getSession('USER');
    console.log("User", User)
    console.log("UserId", data.userId)
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
        if (data.removePiece) {
            let img = document.getElementById(`D-${data.removePiece}`).querySelector(`img`)
            document.getElementById(`D-${data.removePiece}`).removeChild(img)
        }
        let img = document.getElementById(`${data.emptyBoxId}`).querySelector(`img`)
        document.getElementById(`${data.emptyBoxId}`).removeChild(img)
        document.getElementById(`${data.addBoxId}`).appendChild(img)
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
    }
})