import {socket} from "../api";

export const LOGIN_REQUEST = 'LOGIN_REQUEST';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAIL = 'LOGIN_FAIL';
export const LOGOUT = 'LOGOUT';


export function handleLogin(login) {
	return async function(dispatch) {
		dispatch({
			type: LOGIN_REQUEST,
		});

		socket.emit('login', login, function(user) {
			if (user) {
				dispatch({
					type: LOGIN_SUCCESS,
					payload: user,
				});

				localStorage.setItem('ForaSoft-login', user.login);
				localStorage.setItem('ForaSoft-chatRoomId', user.chatRoomId);

				return true;
			} else {
				dispatch({
					type: LOGIN_FAIL,
					payload: {message: "Ошибка входа попробуйте позже."},
				});
				return false;
			}
		});
	}
}

export function handleLogout() {
	return function(dispatch) {
		dispatch({
			type: LOGOUT,
		});
		socket.emit('logout');

	}
}

export function connectUser(login) {
	return function(dispatch) {
		console.log(login);
		socket.emit('connectUser', login);
	}
}
