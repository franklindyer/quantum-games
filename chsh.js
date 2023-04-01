const Game = require("./game.js")

let game = new Game();

class ClassicCHSH extends Game {

    constructor(host) {
	super(host);
	this.x = false;
	this.y = false;
    }

    addplayer(player) {
	this.others.push(player);
	this.reset();
	return true;
    }
    
    reset() {
	this.x = false;
	this.y = false;
	this.a = null;
	this.b = null;
	if (Math.random() < 0.5) this.x = true;
	if (Math.random() < 0.5) this.y = true;

	let startmsg = "New game!\nThe moderator gives you the bit ";
	this.send(0, { message: startmsg + (this.x ? "1" : "0") });
	this.send(1, { message: startmsg + (this.y ? "1" : "0") });
    }

    send(n, data) {
	let msg = {
	    type: "ingame",
	    data: data
	}
	if (n == 0) this.host.sock.send(JSON.stringify(msg));
	if (n == 1) this.others[0].sock.send(JSON.stringify(msg));
    }

    handlemsg(sock, data) {
	let recvmsg = "Your choice was received!";
	if (sock == this.host.sock) {
	    if (this.a == null) this.a = data.choice;
	    this.send(0, { message: recvmsg });
	} else {
	    if (this.b == null) this.b = data.choice;
	    this.send(1, { message: recvmsg });
	}

	if (this.a != null && this.b != null) {
	    let win = (this.a == this.b) ^ (this.x && this.y);
	    this.plays += 1;
	    if (win) this.wins += 1;
	    let endmsg = "";
	    endmsg += "The moderator's bits were " + (this.a ? "1" : "0") + " and " + (this.b ? "1" : "0") + " and your choices were " + (this.x ? "1" : "0") + " and " + (this.y ? "1" : "0") + ".";
	    if (win) {
		endmsg += "\nYou won the game!"
	    } else {
		endmsg += "\nYou lost the game."
	    }
	    endmsg += "\nCurrent win rate: " + this.wins.toString() + "/" + this.plays.toString();
	    
	    this.send(0, { message: endmsg });
	    this.send(1, { message: endmsg });

	    this.reset();
	}

	
    }
    
}

module.exports = {
    ClassicCHSH : ClassicCHSH
}
