const Game = require("./game.js")

class Chatroom extends Game {

    constructor(host) {
	super(host);
	this.send(0, { message: "You are alone in your chatroom." });
    }

    addplayer(player) {
	this.others.push(player);
	return true;
    }

    reset() {}

    send(n, data) {
	let msg = {
	    type: "ingame",
	    data: data
	}
	if (n == 0) this.host.sock.send(JSON.stringify(msg));
	if (n == 1) this.others[0].sock.send(JSON.stringify(msg));
    }

    handlemsg(sock, data) {
	console.log(data.message);
	this.send(0, { message: "Someone said: " + data.message });
	this.send(1, { message: "Someone said: " + data.message }); 
    }
    
    reset() {}
    
}

module.exports = {
    Chatroom : Chatroom
}
