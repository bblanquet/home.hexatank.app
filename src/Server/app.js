const fs = require('fs');

const privateKey  = fs.readFileSync('/etc/letsencrypt/live/www.mottet.xyz/privkey.pem');
const certificate = fs.readFileSync('/etc/letsencrypt/live/www.mottet.xyz/fullchain.pem');
const credentials = {key: privateKey, cert: certificate};

var app = require('express')();
var https = require('https').createServer(credentials,app);
var io = require('socket.io')(https);
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
    console.log('leaving: ' + data.ServerName);
    socket.leave(data.ServerName);
    
    let servs = servers.filter(r=>r.ServerName === data.ServerName);
    
    if(servs.length === 1)
    {
      let server = servs[0];
      server.Players = server.Players.filter(p=>p !== data.PlayerName);
      io.in(data.ServerName).emit('players',{'list':server.Players});
    }
  });

  socket.on('kick',function(data){
    console.log('kicking: ' + data.ServerName);
    let servs = servers.filter(r=>r.ServerName === data.ServerName);
    if(servs.length === 1)
    {
      let server = servs[0];
      server.Players = server.Players.filter(p=>p !== data.PlayerName);
      io.in(data.ServerName).emit('kick',{'PlayerName':data.PlayerName});
    }
  });

  socket.on('remove', function(data)
  {
    if(servers.filter(r=>r.ServerName === data).length === 1)
    {
      console.log('closing: ' + data);
      
      io.in(data).emit('close');

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
    io.to(socket.id).emit('rooms',{'serverNames':servers.map(s=>s.ServerName)});
  });

  socket.on('signaling',function(data){
    let type =  data.message.candidate ? "candidate" :"sdp";
    console.log(data.PlayerName + ' sends ' + type + '.');    
    io.in(data.ServerName).emit('signaling',{...data.message,PlayerName:data.PlayerName});
  });

});

https.listen(8080, function(){
  console.log('listening on *:8080');
});