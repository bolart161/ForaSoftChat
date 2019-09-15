const MongoClient = require('mongodb').MongoClient;
const mongo = require('mongodb');

async function isChatRoomExist(chatRoomId) {
	const id = new mongo.ObjectId(chatRoomId);
	let ex;

	await db.collection('chatRooms').findOne({_id: id}).then((err, chatRoom)=>{
	 ex = chatRoom
	});

	return !!ex;
}

async function createChatRoom(ownerLogin) {
	const chatRoom = {
		ownerLogin,
		chats: []
	};

	await db.collection('chatRooms').insertOne(chatRoom);
	return chatRoom;
}

async function getChatRoom(chatRoomId) {
	const id = new mongo.ObjectId(chatRoomId);
	let chatRoom = {
		ownerLogin: '',
		chats: []
	};

	await db.collection('chatRooms').findOne({_id: id}).then(data => {
		chatRoom = data;
	});

	return chatRoom;
}

async function isUserExist(login) {
	let ex;
 	await db.collection('users').findOne({login}).then((user) => {
		ex = user;
	});

	return !!ex;
}

async function createUser(login) {
	let chatRoom = await createChatRoom(login);

	let user = {
		login,
		chatRoomId: chatRoom._id,
		isOnline: true,
	};

	await db.collection('users').insertOne(user);
	return user;
}

async function getUser(login) {
	let user = null;

	await db.collection('users').findOne({login: login}).then(data => {
		user = data;
	});

	return user;
}

async function createChat(user, chatName) {
	const id = new mongo.ObjectId(user.chatRoomId);

	let chat = {
		chatName,
		users: [{
				login: user.login,
			}],
		messages: []
	};

	let chatRoom = null;
	await db.collection('chats').insertOne(chat);

	await db.collection('chatRooms').findOne({_id: id}).then(data => {
		chatRoom = data;
	});

	chatRoom.chats.push({_id: chat._id});

	await db.collection('chatRooms').update({_id: id}, chatRoom);

	return chatRoom;
}

async function getChat(chatId) {
	const id = new mongo.ObjectId(chatId);
	let chat = null;

	await db.collection('chats').findOne({_id: id}).then(data => {
		chat = data;
	});

	return chat;
}

async function sendMessage(chatId, message) {
	const id = new mongo.ObjectId(chatId);
	let chat = null;

	await db.collection('chats').findOne({_id: id}).then(data => {
		chat = data;
	});

	if (chat) {
		chat.messages.push(message);
		await db.collection('chats').update({_id: id}, chat);
		return true;
	} else {
		return false;
	}
}

async function joinToChat(user, chatId) {
	let chatRoom = null;
	let chat = null;

	await getChat(chatId).then(data => {
		chat = data;
	});

	chat.users.push({login: user.login});

	await db.collection('chats').update({_id: mongo.ObjectId(chatId)}, chat);

	await getChatRoom(user.chatRoomId).then(data => {
		chatRoom = data;
	});

	if (chat) {
		chatRoom.chats.push({_id: chatId});

		const id = mongo.ObjectId(user.chatRoomId);
		await db.collection('chatRooms').update({_id: id}, chatRoom);
	}

	return chatRoom;
}

async function setUserStatusOnline(userLogin, status) {
	let user = null;

	await db.collection('users').findOne({login: userLogin}).then(data => {
		user = data;
	});

	user = {...user, isOnline: status};

	await db.collection('users').update({login: userLogin}, user);

	return;
}

MongoClient.connect('mongodb://localhost:27017/myapi',  { useNewUrlParser: true } , function (err, database) {
	if (err) {
		return console.log(err);
	}

	db = database.db('ForaSoftChat');
});

module.exports = {
	createUser,
	getUser,
	isUserExist,
	createChatRoom,
	getChatRoom,
	createChat,
	getChat,
	sendMessage,
	joinToChat,
	setUserStatusOnline,
};
