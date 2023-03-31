const express = require('express');
const WebSocket = require('ws');
const http = require('http');
const path = require('path');
const json = require('json');
const Player = require('./player.js').Player;
const SocketPlayer = require('./player.js').SocketPlayer;
var app = express();

let server = new WebSocket.Server({ port: 8081 });

let players = []
server.on('connection', function(sock) {
    player = new SocketPlayer(sock, "nogame");
    players.push(player);
    console.log("Received new socket.");
	      let hiText = "Welcome, new player! You have been assigned the ID " + player.id.toString();
    sock.send(JSON.stringify({ type : "update", text : hiText }));
    
    sock.on('close', function() {
	players = players.filter(p => p.sock !== sock);
	console.log("Socket closed.");
    });
})

app.use(express.static('toserve'));

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/toserve/index.html'));
});

console.log('serving port 8080');

app.listen(8080);
