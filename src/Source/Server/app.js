var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

var servers = [];

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket)
{
  console.log('connected ' + socket.client.id);
  
  socket.on('create', function(data) 
  {
    if(servers.filter(r=>r.ServerName === data).length === 0)
    {
      console.log('create room ' + data);
      servers.push({
        'ServerName':data,
        'Players':[]
      });
    }
  });

  socket.on('leave',function(data){
    console.log('leaving: ' + data);
    io.sockets.sockets[socketId].leave(data);
  });

  socket.on('remove', function(data)
  {
    if(servers.filter(r=>r.ServerName === data).length === 1)
    {
      console.log('deleting: ' + data);
      io.of('/').in(data).clients((error, socketIds) => {
        if (error){
          throw error;
        }
        socketIds.forEach(socketId => io.sockets.sockets[socketId].leave(data));
      });
      servers = servers.filter(r=>r.ServerName !== data);
    }
  });

  socket.on('join', function(data) 
  {
    if(servers.filter(r=>r.ServerName === data.ServerName).length === 1)
    {
      let server = servers.filter(r=>r.ServerName === data.ServerName)[0];
      console.log('join room ' + data.ServerName);
      socket.join(data.ServerName);
      server.Players.push(data.PlayerName);
      
      io.in(data.ServerName).emit('players',{'list':server.Players});
    }
  });

  socket.on('rooms',function(){
    console.log('foreact available rooms');
    io.to(socket.id).emit('rooms',{'serverNames':servers.map(s=>s.ServerName)});
  });

});

http.listen(3000, function(){
  console.log('listening on *:3000');
});