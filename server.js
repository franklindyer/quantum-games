const Game = require('./game.js');
const Chatroom = require('./chatroom.js').Chatroom;
const ClassicCHSH = require('./chsh.js').ClassicCHSH;

const express = require('express');
const WebSocket = require('ws');
const http = require('http');
const path = require('path');
const json = require('json');
const Player = require('./player.js').Player;
const SocketPlayer = require('./player.js').SocketPlayer;
var app = express();

function infoMsg(sock, msg) {
    sock.send(JSON.stringify({
	type : "info",
	text : msg
    }));
}

let server = new WebSocket.Server({ port: 8081 });

let gamesEnabled = {
    "chatroom" : Chatroom,
    "chsh" : ClassicCHSH
};

// Maybe it would be good to make a "game manager" class to encapsulate this
let players = [];
let gamesPending = [];
let gamesActive = [];

let sockets = []
server.on('connection', function(sock) {
    sockets.push(sock);
    console.log("Received new socket.");
    sock.send(JSON.stringify({ type : "info", text : "Connected!" }));

    let player = null;
    let G = null;
    let game = null;
    
    sock.onmessage = function(evt) {
	let msg = JSON.parse(evt.data);
	if (msg.type == "newgame") { // Handle new game requests
	    if (msg.game in gamesEnabled) {
		player = new SocketPlayer(sock);
		G = gamesEnabled[msg.game];
		game = new G(player);
		players.push(player);
		gamesPending.push(game);
		infoMsg(sock, "Your " + msg.game + " game has begun");
		infoMsg(sock, "Your host ID is " + player.id.toString());
	    } else {
		infoMsg(sock, "Error: the game \"" + msg.game + "\" does not exist.");
	    }
	} else if (msg.type == "joingame") { // Handle join game requests
	    let gamenum = Number(msg.gamenum);
	    let match = null;
	    gamesPending.forEach(g => {
		if (g.host.id == gamenum) { match = g; return; }
	    });
	    if (match == null) {
		infoMsg(sock, gamenum.toString() + " is not an active game ID.");
	    } else {
		game = match;
		player = new SocketPlayer(sock)
		if (match.addplayer(player)) {
		    gamesActive.push(game);
		    gamesPending = gamesPending.splice(gamesPending.indexOf(game), 1);
		}
	    }
	} else if (msg.type == "ingame") { // Handle in-game interaction
	    if (game == null) return;
	    if (gamesActive.includes(game)) {
		game.handlemsg(sock, msg.data);
	    }
	}
    };

    // When a socket closes, we must remove the associated player
    //   as well as any game being hosted by that player
    sock.on('close', function() {
	sockets = sockets.filter(s => s !== sock);
	players = players.filter(p => p.sock !== sock);
	gamesPending = gamesPending.filter(g => g.host.sock !== sock);
	console.log("Socket closed.");
    });
})

app.use(express.static('toserve'));

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/toserve/index.html'));
});

console.log('serving port 8080');

app.listen(8080);
