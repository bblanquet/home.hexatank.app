const fs = require('fs');
const privateKey = fs.readFileSync('/etc/letsencrypt/live/www.mottet.xyz/privkey.pem');
const certificate = fs.readFileSync('/etc/letsencrypt/live/www.mottet.xyz/fullchain.pem');
const credentials = { key: privateKey, cert: certificate };
var app = require('express')();
var https = require('https').createServer(credentials, app);
var io = require('socket.io')(https);

class Room {
	constructor() {
		this.Name = '';
		this.Players = [];
	}

	Exist(playerName) {
		return 0 < this.Players.filter((p) => p === playerName).length;
	}

	AddPlayer(playerName) {
		this.Players.push(playerName);
	}

	RemovePlayer(playerName) {
		this.Players = this.Players.filter((p) => p !== playerName);
	}
}

class RoomManager {
	constructor() {
		this.Rooms = [];
	}

	Exist(roomName) {
		return 0 < this.Rooms.filter((r) => r.RoomName === roomName).length;
	}

	AddRoom(roomName) {
		if (this.Exist(roomName)) {
			console.log('create room ' + roomName);
			let room = new Room();
			room.Name = roomName;
			this.Rooms.push(room);
		}
	}

	RemoveRoom(room) {
		this.Rooms = this.Rooms.filter((r) => r !== room);
	}

	Get(roomName) {
		return this.Rooms.filter((r) => r.RoomName === roomName)[0];
	}

	RemovePlayer(playerName, room) {
		if (this.Exist(room)) {
			let room = this.Get(room);
			room.AddPlayer(playerName);
		}
	}
}

var roomManager = new RoomManager();

app.get('/', function(req, res) {
	res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket) {
	console.log('[connected] socketId ' + socket.client.id);
	socket.on('create', function(roomName) {
		if (roomManager.Exist(roomName)) {
			console.log('[created] Room ' + roomName);
			roomManager.AddRoom(roomName);
		}
	});

	socket.on('leave', function(data) {
		socket.leave(data.RoomName);

		if (roomManager.Exist(data.RoomName)) {
			let room = roomManager.Get(data.RoomName);
			if (room.Exist(data.PlayerName)) {
				console.log('[leaving] ' + data.RoomName + ' Player ' + data.PlayerName);
				let room = roomManager.Get(data.RoomName);
				room.RemovePlayer(data.PlayerName);
				io.in(data.RoomName).emit('players', { Players: room.Players });
				if (room.Players.length === 0) {
					Leave(data);
				}
			}
		}
	});

	socket.on('kick', function(data) {
		if (roomManager.Exist(data.RoomName)) {
			let room = roomManager.Get(data.RoomName);
			if (room.Exist(data.PlayerName)) {
				console.log('[kicking] Room' + data.RoomName + ' Player ' + data.PlayerName);
				room.RemovePlayer(data.PlayerName);
				io.in(data.RoomName).emit('kick', { PlayerName: data.PlayerName });
			}
		}
	});

	socket.on('remove', function(data) {
		if (roomManager.Exist(data.RoomName)) {
			Leave(data);
		}
	});

	socket.on('join', function(data) {
		if (roomManager.Exist(data.RoomName)) {
			let room = roomManager.Get(data.RoomName);
			room.AddPlayer(data.PlayerName);
			socket.join(data.RoomName);
			io.in(data.RoomName).emit('players', { list: server.Players });
			console.log('[join] Room ' + data.RoomName + ' Player ' + data.PlayerName);
		}
	});

	socket.on('rooms', function() {
		io.to(socket.id).emit('rooms', { RoomNames: roomManager.Rooms.map((r) => r.Name) });
	});

	socket.on('signaling', function(data) {
		let type = data.message.candidate ? 'candidate' : 'sdp';
		console.log(data.PlayerName + ' sends ' + type + '.');
		io.in(data.RoomName).emit('signaling', { ...data.message, Sender: data.Sender, Receiver: data.Receiver });
	});
});

https.listen(8080, function() {
	console.log('listening on *:8080');
});

function Leave(data) {
	io.of('/').in(data).clients((error, socketIds) => {
		if (error) {
			throw error;
		}
		socketIds.forEach((socketId) => io.sockets.sockets[socketId].leave(data));
	});
	roomManager.RemoveRoom(data.RoomName);
	console.log('[closed] Room' + data);
	io.in(data).emit('close');
}
