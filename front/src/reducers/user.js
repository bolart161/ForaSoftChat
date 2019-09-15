import {
	LOGIN_REQUEST,
	LOGIN_SUCCESS,
	LOGIN_FAIL,
	LOGOUT,
} from '../actions/UserActions'

const initialState = {
	user: {
		login: localStorage.getItem('ForaSoft-login'),
		chatRoomId: localStorage.getItem('ForaSoft-chatRoomId')
	},
	error: '',
	isFetching: false,
};

export function userReducer(state = initialState, action) {
	switch (action.type) {
		case LOGIN_REQUEST:
			return { ...state, isFetching: true, error: '' };

		case LOGIN_SUCCESS:
			return { ...state, isFetching: false, user: action.payload };

		case LOGIN_FAIL:
			return { ...state, isFetching: false, error: action.payload.message };

		case LOGOUT:
			return { ...state, isFetching: false, user: {login: null, chatRoomId: null} };

		default:
			return state
	}
}