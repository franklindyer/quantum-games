class Game {

    constructor(host) {
	this.host = host;
	this.others = [];
	this.plays = 0;
	this.wins = 0;
    }

    // Return true iff the game is now full
    addplayer(player) {}
    
    reset() {}

    // Expects the data argument to be JSON
    handlemsg(sock, data) {}

    // Expects the data argument to be JSON
    send(playerNum, data) {}
    
    rungame() {}
    
}

module.exports = Game;
