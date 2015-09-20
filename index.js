var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

// usernames which are currently connected to the chat
var usernames = {};

app.get('/', function(req, res){
  res.sendFile(__dirname + '/public/index.html');
});

app.use(express.static(__dirname + '/public'));

io.sockets.on('connection', function(socket) {
	
	// when the client emits 'sendchat', this listens and executes
	socket.on('sendchat', function (data) {
		console.log('sendchat: ' + socket.username + ': ' + data);
		// we tell the client to execute 'updatechat' with 2 parameters
		io.sockets.emit('updatechat', socket.username, data);
	});

	socket.on('adduser', function(username){
		// we store the username in the socket session for this client
		socket.username = username;
		// add the client's username to the global list
		usernames[username] = username;
		// echo to client they've connected
		socket.emit('updatechat', 'SERVER', 'You have connected.');
		// echo globally (all clients) that a person has connected
		socket.broadcast.emit('updatechat', 'SERVER', username + ' has joined the channel.');
		// update the list of users in chat, client-side
		io.sockets.emit('updateusers', usernames);
	});

	// when the user disconnects.. perform this
	socket.on('disconnect', function(){
		// remove the username from global usernames list
		delete usernames[socket.username];
		// update list of users in chat, client-side
		io.sockets.emit('updateusers', usernames);
		// echo globally that this client has left
		socket.broadcast.emit('updatechat', 'SERVER', socket.username + ' has left the channel.');
	});
});


http.listen(3000, function(){
  console.log('Listening on *:3000');
});
