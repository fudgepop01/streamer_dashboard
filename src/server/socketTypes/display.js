import ControlSocket from "./control";

/**
 * 
 *
 * @class DisplaySocket
 */
class DisplaySocket {
  /**
   * Creates an instance of ControlSocket.
   * @param {SocketIO.Socket} socket
   * @param {Object<string, ControlSocket>} controlSockets
   * @param {Object<string, DisplaySocket>} displaySockets
   * @memberof DisplaySocket
   */
  constructor(socket, controlSockets, displaySockets) {
    this.socket = socket;
    this.controlSockets = controlSockets;
    this.displaySockets = displaySockets;

    socket.on("layoutData", (layout) => this.layoutData(layout));
    socket.on("disconnect", () => this.disconnect());
  }

  changeLayout(layout) {
    this.socket.emit("changeLayout", layout);
  }

  execScript(scr) {
    this.socket.emit("execScript", scr);
  }

  transition() {
    this.socket.emit("transition");
  }

  layoutData(data) {
    for (const control of Object.values(this.controlSockets)) {
      control.layoutData(data);
    }
  }

  disconnect() {
    delete this.displaySockets[this.socket.id];
  }
}

export default DisplaySocket;