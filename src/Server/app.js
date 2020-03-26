const fs = require('fs');
const privateKey = fs.readFileSync('/etc/letsencrypt/live/www.mottet.xyz/privkey.pem');
const certificate = fs.readFileSync('/etc/letsencrypt/live/www.mottet.xyz/fullchain.pem');
const credentials = { key: privateKey, cert: certificate };
var app = require('express')();
var https = require('https').createServer(credentials, app);
var io = require('socket.io')(https);

class Room {
	constructor() {
		this.Key = Math.random().toString(36).substring(7);
		this.IsHidden = false;
		this.Name = '';
		this.Players = [];
	}

	Exist(playerName) {
		return 0 < this.Players.filter((p) => p.Name === playerName).length;
	}

	AddPlayer(name, id) {
		let player = new Player();
		player.Name = name;
		player.Id = id;
		this.Players.push(player);
	}

	ChangeId(name, id) {
		this.RemovePlayer(name);
		let player = new Player();
		player.Name = name;
		player.Id = id;
		this.Players.push(player);
	}

	PlayerNames() {
		return this.Players.map((p) => p.Name);
	}

	RemovePlayer(playerName) {
		this.Players = this.Players.filter((p) => p.Name !== playerName);
	}
}

class Player {
	constructor() {
		this.Name = '';
		this.Id = '';
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
var isCollecting = false;

function CollectGarbage() {
	if (!isCollecting) {
		isCollecting = true;
		let collector = setInterval(() => {
			console.log('[collecting] start');
			if (io && io.sockets) {
				if (roomManager && roomManager.Rooms) {
					console.log('[collecting] rooms ' + roomManager.Rooms.length);
					if (roomManager.Rooms.length === 0) {
						clearInterval(collector);
						isCollecting = false;
						return;
					}

					const emptyRooms = [];
					roomManager.Rooms.forEach((room) => {
						let count = room.Players.length;
						let disconnected = 0;
						room.Players.forEach((player) => {
							if (!io.sockets.sockets[player.Id]) {
								disconnected += 1;
							}
						});
						if (count === disconnected) {
							emptyRooms.push(room.Name);
						}
					});
					emptyRooms.forEach((emptyRoom) => {
						console.log('[clear] room ' + emptyRoom);
						roomManager.RemoveRoom(emptyRoom);
					});
				}
			}
		}, 5000);
	}
}

io.on('connection', function(socket) {
	console.log('[connected] socketId ' + socket.client.id);
	socket.on('Create', (data) => Create(data));

	socket.on('Leave', function(data) {
		socket.leave(data.RoomName);

		if (roomManager.Exist(data.RoomName)) {
			let room = roomManager.Get(data.RoomName);
			if (room.Exist(data.PlayerName)) {
				console.log('[leaving] ' + data.RoomName + ' Player ' + data.PlayerName);
				let room = roomManager.Get(data.RoomName);
				room.RemovePlayer(data.PlayerName, data.RoomName);
				io.in(data.RoomName).emit('Players', { Content: room.PlayerNames() });
				if (room.Players.length === 0) {
					Leave(data);
				}
			}
		}
	});

	socket.on('Kick', function(data) {
		if (roomManager.Exist(data.RoomName)) {
			let room = roomManager.Get(data.RoomName);
			if (room.Exist(data.PlayerName)) {
				console.log('[kicking] Room' + data.RoomName + ' Player ' + data.PlayerName);
				room.RemovePlayer(data.PlayerName, data.RoomName);
				io.in(data.RoomName).emit('Kick', { PlayerName: data.PlayerName });
				io.in(data.RoomName).emit('Players', { Content: room.PlayerNames() });
			}
		}
	});

	socket.on('Remove', function(data) {
		if (roomManager.Exist(data.RoomName)) {
			Leave(data);
		}
	});

	socket.on('Hide', function(data) {
		if (roomManager.Exist(data.RoomName)) {
			roomManager.Get(data.RoomName).IsHidden = true;
		}
	});

	socket.on('Exist', function(data) {
		if (roomManager.Exist(data.RoomName)) {
			io.to(socket.id).emit('Exist', { Exist: true, RoomName: data.RoomName });
		} else {
			io.to(socket.id).emit('Exist', { Exist: false, RoomName: data.RoomName });
		}
	});

	socket.on('Available', function(data) {
		if (roomManager.Exist(data.RoomName)) {
			let room = roomManager.Get(data.RoomName);
			if (room.Exist(data.PlayerName)) {
				console.log('[Not Available] Room ' + data.RoomName + ' Player ' + data.PlayerName);
				io.to(socket.id).emit('Available', { IsAvailable: false, RoomName: data.RoomName });
			} else {
				console.log('[Available] Room ' + data.RoomName + ' Player ' + data.PlayerName);
				io.to(socket.id).emit('Available', { IsAvailable: true, RoomName: data.RoomName });
			}
		}
	});

	socket.on('Join', function(data) {
		console.log('[joining] Room ' + data.RoomName + ' Player ' + data.PlayerName);
		Create(data.RoomName);
		let room = roomManager.Get(data.RoomName);
		if (data.Key) {
			socket.join(data.RoomName);
			room.ChangeId(data.PlayerName, socket.client.id);
			console.log('[joined again] Room ' + data.RoomName + ' Player ' + data.PlayerName);
		} else {
			room.AddPlayer(data.PlayerName, socket.client.id);
			socket.join(data.RoomName);
			io.to(socket.id).emit('Joined', { Content: room.Key });
			console.log('[joined] Room ' + data.RoomName + ' Player ' + data.PlayerName);
		}
		io.in(data.RoomName).emit('Players', { Content: room.PlayerNames() });
	});

	socket.on('Rooms', function() {
		io.to(socket.id).emit('Rooms', { Content: roomManager.Rooms.filter((r) => !r.IsHidden).map((r) => r.Name) });
	});

	socket.on('Offer', function(data) {
		console.log(data.Emitter + ' sends offer to ' + data.Recipient + '.');
		io.in(data.RoomName).emit('Offer', data);
	});

	socket.on('Candidate', function(data) {
		console.log(data.Emitter + ' sends candidate to ' + data.Recipient + '.');
		io.in(data.RoomName).emit('Candidate', data);
	});

	socket.on('OneWayPing', function(data) {
		console.log(data.Emitter + ' sends OneWayPing to ' + data.Recipient + '.');
		io.in(data.RoomName).emit('OneWayPing', data);
	});

	socket.on('TwoWayPing', function(data) {
		console.log(data.Emitter + ' sends TwoWayPing to ' + data.Recipient + '.');
		io.in(data.RoomName).emit('TwoWayPing', data);
	});

	socket.on('Reset', function(data) {
		console.log(data.Emitter + ' sends Reset to ' + data.Recipient + '.');
		io.in(data.RoomName).emit('Reset', data);
	});
});

https.listen(9117, function() {
	console.log('listening on *:9117');
});

function Create(roomName) {
	console.log('[creating] room');
	if (!roomManager.Exist(roomName)) {
		roomManager.AddRoom(roomName);
		console.log('[created] room');
		CollectGarbage();
	} else {
		console.log('[not created] Room already exists ' + roomName);
	}
}

function Leave(data) {
	io.of('/').in(data).clients((error, socketIds) => {
		if (error) {
			throw error;
		}
		socketIds.forEach((socketId) => io.sockets.sockets[socketId].leave(data));
	});
	roomManager.RemoveRoom(data.RoomName);
	console.log('[closed] Room ' + data.RoomName);
	io.in(data).emit('Close');
}
