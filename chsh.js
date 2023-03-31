const Game = require("./game.js")

let game = new Game();

class ClassicCHSH extends Game {

    constructor(host) {
	super(host);
	this.x = false;
	this.y = false;
    }

    reset() {
	this.x = null;
	this.y = null;
	this.a = false;
	this.b = false;
	if (Math.random() < 0.5) this.a = true;
	if (Math.random() < 0.5) this.b = true;
    }

    
    
}

module.exports = {
    ClassicCHSH : ClassicCHSH
}
