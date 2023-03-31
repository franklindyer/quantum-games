const Game = require("./game.js")

let game = new Game();

class classicCHSH extends Game {

    constructor() {
	super();
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

for (i = 0; i < 20; i++) {
    g = new classicCHSH()
    g.reset()
    console.log(g.a);
}

console.log("hey")
