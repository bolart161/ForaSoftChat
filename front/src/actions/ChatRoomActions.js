import { socket } from "../api";

export const GET_CHATROOM_REQUEST = 'GET_CHATROOM_REQUEST';
export const GET_CHATROOM_SUCCESS = 'GET_CHATROOM_SUCCESS';
export const GET_CHATROOM_FAIL = 'GET_CHATROOM_FAIL';
export const JOIN_TO_CHAT_REQUEST = 'JOIN_TO_CHAT_REQUEST';
export const JOIN_TO_CHAT_SUCCESS = 'JOIN_TO_CHAT_SUCCESS';
export const JOIN_TO_CHAT_FAIL = 'JOIN_TO_CHAT_FAIL';
export const CREATE_CHAT_REQUEST = 'CREATE_CHAT_REQUEST';
export const CREATE_CHAT_SUCCESS = 'CREATE_CHAT_SUCCESS';
export const CREATE_CHAT_FAIL = 'CREATE_CHAT_FAIL';
export const SEND_MESSAGE = 'SEND_MESSAGE';
export const UPDATE_CHATROOM = 'UPDATE_CHATROOM';

export function getChatRoom(user) {
	return function(dispatch) {
		dispatch({
			type: GET_CHATROOM_REQUEST,
		});
		socket.emit('getChatRoom', user, function(chatRoom) {
			if (chatRoom) {
				dispatch({
					type: GET_CHATROOM_SUCCESS,
					payload: chatRoom,
				});
				return true;
			} else {
				dispatch({
					type: GET_CHATROOM_FAIL,
					payload: {message: "Ошибка загрузки комнаты попробуйте позже."},
				});
				return false;
			}
		});
	}
}

export function createChat(user, chatId) {
	return function(dispatch) {
		dispatch({
			type: CREATE_CHAT_REQUEST,
		});
		socket.emit('createChat', user, chatId, function(chatRoom) {
			if (chatRoom) {
				dispatch({
					type: CREATE_CHAT_SUCCESS,
					payload: chatRoom,
				});
				return true;
			} else {
				dispatch({
					type: CREATE_CHAT_FAIL,
					payload: {message: "Ошибка создания чата попробуйте позже."},
				});
				return false;
			}
		});
	}
}

export function joinToChat(user, chatId) {
	return function(dispatch) {
		dispatch({
			type: JOIN_TO_CHAT_REQUEST,
		});

		socket.emit('joinToChat', user, chatId, chatRoom => {
			if (chatRoom) {
				dispatch({
					type: JOIN_TO_CHAT_SUCCESS,
					payload: chatRoom,
				});
				return true;
			} else {
				dispatch({
					type: JOIN_TO_CHAT_FAIL,
					payload: {message: "Ошибка добавления чата попробуйте позже."},
				});
				return false;
			}
		});
	}
}

export function sendMessage(chatId, message) {
	return function (dispatch) {
		dispatch({
			type: SEND_MESSAGE,
		});
		socket.emit('sendMessage', chatId, message, (status) => {
			console.log(status);
		});
	}
}

export function updateChatRoom() {
	return function (dispatch) {
		const user = {
			login: localStorage.getItem('ForaSoft-login'),
			chatRoomId: localStorage.getItem('ForaSoft-chatRoomId'),
		};

		dispatch({
			type: GET_CHATROOM_REQUEST,
		});

		socket.emit('getChatRoom', user, function(chatRoom) {
			if (chatRoom) {
				dispatch({
					type: GET_CHATROOM_SUCCESS,
					payload: chatRoom,
				});
				return true;
			} else {
				dispatch({
					type: GET_CHATROOM_FAIL,
					payload: {message: "Ошибка загрузки комнаты попробуйте позже."},
				});
				return false;
			}
		});
	}
}