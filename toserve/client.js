function showServerMsg(msg) {
    const msgNode = document.createElement('li');
    const msgText = document.createTextNode(msg);
    msgNode.appendChild(msgText);
    document.getElementById("server-messages").appendChild(msgNode);
}

function handleServerMsg(evt) {
    console.log("Got a server msg.");
    var msg = JSON.parse(evt.data);
    if (msg.type == "info") {
	    showServerMsg(msg.text);
    }
}

// Returns a WebSocket, if successful
function newGame(gameStr) {
    const ws = new WebSocket('ws://localhost:8081');
    ws.onmessage = handleServerMsg;
    var msg = {
	type : "newgame",
	game : gameStr
    };
    ws.onopen = function(e) {
	ws.send(JSON.stringify(msg));
	Array.from(document.getElementsByClassName("pregame")).forEach(
	    elt => { elt.setAttribute("disabled", true); }
	);
    }
    return ws;
}

showServerMsg("No server messages yet.");

// ws.onmessage = function(evt) {
//    var msg = JSON.parse(evt.data);
//    if (msg.type == "info") {
//	showServerMsg(msg.text);
//    }
//}

console.log("Connected to server.");
