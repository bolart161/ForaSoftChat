const DBService = require('./DBService');

class Chat {
	createChat(name) {
		this.chatName = name;
		this.users = [];
		this.messages = [];
	}

	async getChat(id) {
		let chat = null;
		await DBService.getChat(id).then(data => {
			chat = data;
		});

		await Promise.all(Object.keys(chat.users).map(async key => {
			chat.users[key] = await DBService.getUser(chat.users[key].login);
		}));

		return chat;
	}

	async sendMessage(chatId, message) {
		let status = false;
		await DBService.sendMessage(chatId, message).then(data => {
			status = data;
		});

		return status;
	}
}

module.exports = {
		Chat
};