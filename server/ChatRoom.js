const Chat = require("./Chat").Chat;
const DBService = require("./DBService");

class ChatRoom {
	async getChatRoom(user) {
		let chatRoom = null;

		await DBService.getChatRoom(user.chatRoomId).then(data => {
			chatRoom = data;
		});

		await Promise.all(Object.keys(chatRoom.chats).map(async key => {
			await (new Chat()).getChat(chatRoom.chats[key]._id).then(data => {
				chatRoom.chats[key] = data;
			});
		}));

		return chatRoom;
	}

	createChatRoom(login) {
		return DBService.createChatRoom(login);
	}

	async createChat(user, chatName) {
		let chatRoom = null;
		await DBService.createChat(user, chatName).then(data => {
			chatRoom = data;
		});

		await Promise.all(Object.keys(chatRoom.chats).map(async key => {
			await (new Chat()).getChat(chatRoom.chats[key]._id).then(data => {
				chatRoom.chats[key] = data;
			});
		}));

		return chatRoom;
	}

	async joinToChat(user, chatId) {
		let chatRoom = null;

		await DBService.joinToChat(user, chatId).then(data => {
			chatRoom = data
		});

		await Promise.all(Object.keys(chatRoom.chats).map(async key => {
			await (new Chat()).getChat(chatRoom.chats[key]._id).then(data => {
				chatRoom.chats[key] = data;
			});
		}));

		return chatRoom;
	}
}


module.exports = {
	ChatRoom
};