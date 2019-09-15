const Chat = require("./Chat").Chat;
const User = require("./User").User;
const setUserStatusOnline = require("./DBService").setUserStatusOnline;
const ChatRoom = require("./ChatRoom").ChatRoom;

const http = require('http').createServer();
const io = require('socket.io')(http);

const port = 8080;

io.on('connection', function(socket) {
	let userLogin = null;

	socket.on('connectUser', login => {
		userLogin = login;
		setUserStatusOnline(login, true).then(() => {
			io.sockets.emit('updateChatRoom')
		});
	});

	socket.on('login', (login, callback) => {
		(new User()).getUser(login).then(data => {
				callback(data);
		});
	});

	socket.on('getChatRoom', (user, callback) => {
		(new ChatRoom()).getChatRoom(user).then(data => {
			callback(data);
		});
	});

	socket.on('createChat', (user, chatName, callback) => {
		(new ChatRoom()).createChat(user, chatName).then(data => {
			callback(data);
		});
	});

	socket.on('sendMessage', (chatId, message, callback) => {
		(new Chat()).sendMessage(chatId, message).then(status => {
			callback(status);
			if (status) io.sockets.emit('updateChatRoom');
		});
	});

	socket.on('joinToChat', (user, chatId, callback) => {
		userLogin = user.login;
		setUserStatusOnline(user.login, true).then(() => {
			(new ChatRoom()).joinToChat(user, chatId).then(chatRoom => {
				callback(chatRoom);
				if (chatRoom) io.sockets.emit('updateChatRoom');
			})
		})
	});

	socket.on('logout', () => {
		setUserStatusOnline(userLogin, false).then(() => {
			userLogin = null;
			io.sockets.emit('updateChatRoom');
		});
	});

	socket.on('disconnect', function(){
		if (userLogin) {
			setUserStatusOnline(userLogin, false).then(() => {
				io.sockets.emit('updateChatRoom');
				userLogin = null;
			});
		}
	});
});

http.listen(port, function(){
	console.log('listening on *:' + port);
});