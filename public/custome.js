const socket = io();

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



// :::::::::::: SOCKET ON FUNCTIONS ::::::::::::
const popUp = (data) => {
    console.log(`popUp :::: DATA :::: ${JSON.stringify(data)}`)
    alert(data.message)
}
const signUp = (data) => {
    console.log(`signUp :::: DATA :::: ${JSON.stringify(data)}`)
    if (data.message == "ok") {
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
        setUserSession("USER_TABLE", data.tableData, 60)
        document.getElementById('section-2').style.display = "none"
        document.getElementById('section-3').style.display = "block"
        document.getElementById('section-4').style.display = "block"
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
    }
})