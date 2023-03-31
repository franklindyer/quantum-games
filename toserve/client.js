function showServerMsg(msg) {
    const msgNode = document.createElement('li');
    const msgText = document.createTextNode(msg);
    msgNode.appendChild(msgText);
    document.getElementById("server-messages").appendChild(msgNode);
}

showServerMsg("Hoi");
showServerMsg("Hey");

const ws = new WebSocket('ws://localhost:8081');

ws.onmessage = function(evt) {
    var msg = JSON.parse(evt.data);
    if (msg.type == "update") {
	showServerMsg(msg.text);
    }
}

console.log("Connected to server.");
