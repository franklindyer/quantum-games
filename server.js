const Game = require('./game.js');
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

let gamesEnabled = ["chsh"];
let players = [];
let games = [];

let sockets = []
server.on('connection', function(sock) {
    sockets.push(sock);
    console.log("Received new socket.");
    sock.send(JSON.stringify({ type : "info", text : "Connected!" }));

    sock.onmessage = function(evt) {
	console.log("Got data from client!");
	let msg = JSON.parse(evt.data);
	if (msg.type == "newgame") {
	    if (gamesEnabled.includes(msg.game)) {
		let player = new SocketPlayer(sock, msg.game)
		let game = new ClassicCHSH(player);
		players.push(player);
		games.push(game);
		infoMsg(sock, "Your CHSH game has begun");
		infoMsg(sock, "Your player ID is " + player.id.toString());
	    } else {
		infoMsg(sock, "Error: the game \"" + msg.game + "\" does not exist.");
	    }
	}
    };

    // When a socket closes, we must remove the associated player
    //   as well as any game being hosted by that player
    sock.on('close', function() {
	sockets = sockets.filter(s => s !== sock);
	players = players.filter(p => p.sock !== sock);
	games = games.filter(g => g.host.sock !== sock);
	console.log("Socket closed.");
    });
})

app.use(express.static('toserve'));

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/toserve/index.html'));
});

console.log('serving port 8080');

app.listen(8080);
