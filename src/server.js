import sirv from 'sirv';
import httpPkg from 'http';
import express from 'express';
import socketio from 'socket.io';
import { fetchToken, connectToWebSocket } from './server/auth';
import picartoChatManager from './server/chatManager'
import ControlSocket from './server/socketTypes/control';
import DisplaySocket from './server/socketTypes/display';

import compression from 'compression';
import * as sapper from '@sapper/server';

import { readdir } from 'fs';
import { promisify } from 'util';

const pReaddir = promisify(readdir);

const { PORT, NODE_ENV } = process.env;
const dev = NODE_ENV === 'development';

const app = express();
const http = httpPkg.createServer(app); 
const io = socketio(http);

app.use(
	compression({ threshold: 0 }),
	sirv('static', { dev }),
	sapper.middleware()
)

http.listen(PORT, err => {
	if (err) console.log('error', err);
});

(async () => {
	const picartoChat = await connectToWebSocket(await fetchToken());
	const picartoManager = new picartoChatManager(picartoChat);

	// manager.on("ChatMessage", (msg) => {
	// 	if (msg.message === '!ping') manager.sendMessage("awoo!");
	// 	io.emit("ChatMessage", msg);
	// })

	const controlSockets = {};
	const displaySockets = {};
	io.on("connection", async (socket) => {	
    socket.emit("initialize", await pReaddir(`${__dirname}/../../../static/svg`));
		socket.on("pageName", (pageName) => {
			let typedSocket;
			switch(pageName) {
				case 'controls': 
					console.log('derp');
					typedSocket = new ControlSocket(socket, controlSockets, displaySockets);
					controlSockets[typedSocket.socket.id] = typedSocket;
					break;
				case 'display':
					typedSocket = new DisplaySocket(socket, controlSockets, displaySockets);
					displaySockets[typedSocket.socket.id] = typedSocket;
					break;
			}
		})
	})

	picartoManager.on("ChatMessage", (msg) => {
		// if (msg.message === "!ping") picartoManager.sendMessage("pong!");
		for (const conn of Object.values(controlSockets)) {
			conn.socket.emit("ChatMessage", msg);
		}
		for (const conn of Object.values(displaySockets)) {
			conn.socket.emit("ChatMessage", msg);
		}
	})

})()