import { EventEmitter } from "events";
import pb from "protobufjs"
import msgTypes from './picartoMessageTypes';

class picartoChatManager extends EventEmitter {

  /**
   * 
   * @param {WebSocket} chat 
   */
  constructor(chat) {
    super();
    this.chat = chat;
    this.init.bind(this);
    this.init();
  }

  async init() {
    /**
     * Handles incoming messages from the picarto server
     * @param {Buffer} msg 
     * @param {pb.Root} protocol
     */
    const messageHandler = (msg, protocol) => {
      const msgType = protocol.lookupType(msgTypes[msg[0]]);
      const decoded = msgType.decode(msg.slice(1));
      // console.log(decoded);
      this.emit(msgTypes[msg[0]], msgType.decode(msg.slice(1)));
    }

    this.root = await pb.load(`${__dirname}/picartoChat.proto`).then();
    this.chat.on("message", (msg) => messageHandler(msg, this.root)); 
  }

  createOutgoingMessage(type, payload) {
    const msgType = this.root.lookupType(type);
    const message = msgType.create({...payload});
    return Buffer.concat([Buffer.from([msgTypes.indexOf(type)]), msgType.encode(message).finish()]);
  }

  async sendMessage(msg) {
    const outgoing = this.createOutgoingMessage("NewMessage", {
      message: msg
    })
    this.chat.send(outgoing);
  }
}

export default picartoChatManager;