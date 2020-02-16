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
		let count = this.Rooms.filter((r) => r.Name === roomName).length;
		console.log('[count] ' + roomName + ': ' + count);
		return 0 < count;
	}

	AddRoom(roomName) {
		if (!this.Exist(roomName)) {
			let room = new Room();
			room.Name = roomName;
			this.Rooms.push(room);
			console.log('[created] ' + roomName);
		}
	}

	RemoveRoom(roomName) {
		this.Rooms = this.Rooms.filter((r) => r.Name !== roomName);
	}

	Get(roomName) {
		return this.Rooms.filter((r) => r.Name === roomName)[0];
	}

	RemovePlayer(playerName, roomName) {
		if (this.Exist(roomName)) {
			let room = this.Get(room);
			room.RemovePlayer(playerName);
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
		if (!roomManager.Exist(roomName)) {
			roomManager.AddRoom(roomName);
		} else {
			console.log('[not created] Room already exists ' + roomName);
		}
	});

	socket.on('leave', function(data) {
		socket.leave(data.RoomName);

		if (roomManager.Exist(data.RoomName)) {
			let room = roomManager.Get(data.RoomName);
			if (room.Exist(data.PlayerName)) {
				console.log('[leaving] ' + data.RoomName + ' Player ' + data.PlayerName);
				let room = roomManager.Get(data.RoomName);
				room.RemovePlayer(data.PlayerName, data.RoomName);
				io.in(data.RoomName).emit('players', { list: room.Players });
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
				room.RemovePlayer(data.PlayerName, data.RoomName);
				io.in(data.RoomName).emit('kick', { PlayerName: data.PlayerName });
			}
		}
	});

	socket.on('remove', function(data) {
		if (roomManager.Exist(data.RoomName)) {
			Leave(data);
		}
	});

	socket.on('exist', function(data) {
		if (roomManager.Exist(data.RoomName)) {
			io.to(socket.id).emit('exist', { Exist: true, RoomName: data.RoomName });
		} else {
			io.to(socket.id).emit('exist', { Exist: false, RoomName: data.RoomName });
		}
	});

	socket.on('available', function(data) {
		if (roomManager.Exist(data.RoomName)) {
			let room = roomManager.Get(data.RoomName);
			if (room.Exist(data.PlayerName)) {
				console.log('[Not Available] Room ' + data.RoomName + ' Player ' + data.PlayerName);
				io.to(socket.id).emit('available', { IsAvailable: false, RoomName: data.RoomName });
			} else {
				console.log('[Available] Room ' + data.RoomName + ' Player ' + data.PlayerName);
				io.to(socket.id).emit('available', { IsAvailable: true, RoomName: data.RoomName });
			}
		}
	});

	socket.on('join', function(data) {
		if (roomManager.Exist(data.RoomName)) {
			let room = roomManager.Get(data.RoomName);
			room.AddPlayer(data.PlayerName);
			socket.join(data.RoomName);
			io.in(data.RoomName).emit('players', { list: room.Players });
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
	console.log('[closed] Room ' + data.RoomName);
	io.in(data).emit('close');
}
