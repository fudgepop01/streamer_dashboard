import socket from './socket';
import { chatMessages } from '../../components/display/chatMsgStore';

export const initRecievers = () => {
  socket.on("ChatMessage", (msg) => {
    console.log(msg);
    chatMessages.update((n) => {
      n.push(msg);
      return n;
    })
  });

  socket.on("initialize", (msg) => {
    socket.emit("pageName", 'display');
  })

  socket.on("execScript", async (msg) => {
    eval(`(async () => {${msg}})()`);
  })
}
