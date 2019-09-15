import io from "socket.io-client";

export const socket = io.connect('http://bolart.ru:3014');
