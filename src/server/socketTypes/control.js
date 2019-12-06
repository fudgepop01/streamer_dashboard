import DisplaySocket from "./display";

/**
 * 
 *
 * @class controlSocket
 */
class ControlSocket {

  /**
   * Creates an instance of ControlSocket.
   * @param {SocketIO.Socket} socket
   * @param {Object<string, ControlSocket>} controlSockets
   * @param {Object<string, DisplaySocket>} displaySockets
   * @memberof ControlSocket
   */
  constructor(socket, controlSockets, displaySockets) {
    this.socket = socket;
    this.controlSockets = controlSockets;
    this.displaySockets = displaySockets;

    this.receivedLayoutData = false;

    socket.on("changeLayout", (layout) => this.changeLayout(layout));
    socket.on("execScript", (scr) => this.execScript(scr));
    socket.on("transition", () => this.transition());
    socket.on("disconnect", () => this.disconnect());
  }

  changeLayout(layout) {
    for (const control of Object.values(this.controlSockets)) {
      control.receivedLayoutData = false;
    }
    for (const display of Object.values(this.displaySockets)) {
      display.changeLayout(layout);
    }
  }

  execScript(scr) {
    for (const display of Object.values(this.displaySockets)) {
      display.execScript(scr);
    }
  }

  transition() {
    for (const display of Object.values(this.displaySockets)) {
      display.transition();
    }
  }

  layoutData(data) {
    if (this.receivedLayoutData) return;
    this.receivedLayoutData = true;
    this.socket.emit("layoutData", data);
  }

  disconnect() {
    delete this.controlSockets[this.socket.id];
  }
}

export default ControlSocket;