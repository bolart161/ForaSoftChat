import io from "socket.io-client";
import {updateChatRoom} from "../actions/ChatRoomActions";

export const socket = io.connect('http://localhost:8080');