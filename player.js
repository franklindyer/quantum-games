class Player {

    constructor() {}

    send(msg) {}

    recieve(msg) {}
    
}

class SocketPlayer extends Player {

    constructor(sock, game) {
	super();
	this.sock = sock;
	this.game = game;
	this.id = Math.floor(Math.random() * 999999);
    }

    send(msg) {
	sock.send(msg);
    }

    receive(msg) {
	
    }
    
}

module.exports = {
    Player : Player,
    SocketPlayer : SocketPlayer
}
