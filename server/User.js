const DBService = require("./DBService");

class User {
	async createUser(login) {
		let user;
		await DBService.createUser(login).then(data => {
			user = data
		});
		return user;
	}

	async getUser(login) {
		let cond, user = {};

		await DBService.isUserExist(login).then(res => {
			cond = res;
		});

		if (!cond) {
			await this.createUser(login).then(data => {
				user = data;
			})
		} else {
			await DBService.getUser(login).then(data => {
				user = data;
			});
		}

		return user;
	}
}


module.exports = {
	User
};