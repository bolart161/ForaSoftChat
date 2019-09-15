import { combineReducers } from 'redux'
import { chatRoomReducer } from './chatRoom'
import { userReducer } from "./user";

export const rootReducer = combineReducers({
	chatRoom: chatRoomReducer,
	user: userReducer,
});