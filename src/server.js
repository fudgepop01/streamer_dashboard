import sirv from 'sirv';
import httpPkg from 'http';
import express from 'express';
import socketio from 'socket.io';
import { fetchToken, connectToWebSocket } from './server/auth';
import picartoChatManager from './server/chatManager'
import { readdir } from 'fs';
import { promisify } from 'util';

import compression from 'compression';
import * as sapper from '@sapper/server';


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

	const connections = {};
	io.on("connection", async (socket) => {	
		let recievedLayoutData = false;

		socket.emit("initialize", await pReaddir(`${__dirname}/../../../static/svg`));
		connections[socket.id] = socket;
		socket.on("pageName", (pageName) => {
			socket.pageName = pageName;
		})

		socket.on("changeLayout", (layout) => {
			recievedLayoutData = false;
			for (const [key, val] of Object.entries(connections)) {
				if (val.pageName === 'display') {
					val.emit("changeLayout", layout);
				}
			}
		})
		socket.on("execScript", (scr) => {
			for (const [key, val] of Object.entries(connections)) {
				if (val.pageName === 'display') {
					val.emit("execScript", scr);
				}
			}
		})
		socket.on("transition", () => {
			for (const [key, val] of Object.entries(connections)) {
				if (val.pageName === 'display') {
					val.emit("transition");
				}
			}
		})
		socket.on("layoutData", (data) => {
			if (!recievedLayoutData) {
				for (const [key, val] of Object.entries(connections)) {
					if (val.pageName === 'controls') {
						val.emit("layoutData", data);
						recievedLayoutData = true;
					}
				}
			}
		})

		socket.on("disconnect", () => {
			delete connections[socket.id];
		})
	})

	picartoManager.on("ChatMessage", (msg) => {
		if (msg.message === "!ping") picartoManager.sendMessage("pong!");
		for (const [key, val] of Object.entries(connections)) {
			val.emit("ChatMessage", msg);
		}
	})

})()