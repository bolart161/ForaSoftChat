import {
	GET_CHATROOM_REQUEST,
	GET_CHATROOM_SUCCESS,
	GET_CHATROOM_FAIL,
	JOIN_TO_CHAT_REQUEST,
	JOIN_TO_CHAT_SUCCESS,
	JOIN_TO_CHAT_FAIL, CREATE_CHAT_REQUEST, CREATE_CHAT_SUCCESS, CREATE_CHAT_FAIL, UPDATE_CHATROOM,
} from '../actions/ChatRoomActions'

const initialState = {
	loginOwner: null,
	chats: [],
	isFetching: false,
	error: '',
};

export function chatRoomReducer(state = initialState, action) {
	switch (action.type) {
		case GET_CHATROOM_REQUEST:
			return { ...state, loginOwner: action.payload, isFetching: true, error: '' };

		case GET_CHATROOM_SUCCESS:
			return { ...state, chats: action.payload.chats, loginOwner: action.payload.ownerLogin, isFetching: false, error: '' };

		case GET_CHATROOM_FAIL:
			return { ...state, error: action.payload.message, isFetching: false };

		case JOIN_TO_CHAT_REQUEST:
			return { ...state, loginOwner: action.payload, isFetching: true, error: '' };

		case JOIN_TO_CHAT_SUCCESS:
			return { ...state, chats: action.payload.chats, loginOwner: action.payload.ownerLogin, isFetching: false, error: '' };

		case JOIN_TO_CHAT_FAIL:
			return { ...state, error: action.payload.message, isFetching: false };

		case CREATE_CHAT_REQUEST:
			return { ...state, loginOwner: action.payload, isFetching: true, error: '' };

		case CREATE_CHAT_SUCCESS:
			return { ...state, chats: action.payload.chats, loginOwner: action.payload.ownerLogin, isFetching: false, error: '' };

		case CREATE_CHAT_FAIL:
			return { ...state, error: action.payload.message, isFetching: false };

		case UPDATE_CHATROOM:
			return { ...state, chats: action.payload.chats };

		default:
			return state
	}
}