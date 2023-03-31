class Game {

    constructor(host) {
	this.host = host;
	this.others = [];
	this.plays = 0;
	this.wins = 0;
    }

    reset() {}

    getmove(playerNum) {}

    send(playerNum, msg) {}
    
    rungame() {}
    
}

module.exports = Game;
