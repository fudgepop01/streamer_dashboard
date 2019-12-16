import socket from './socket';

// GETTERS -----------------------------------------

export const getNumSockets = () => {
  return new Promise((resolve) => {
    const resolveFn = (numSockets) => {
      socket.removeEventListener("numSockets", resolveFn);
      resolve(numSockets);
    }

    socket.emit("getNumSockets");
    socket.on("numSockets", resolveFn);
  })
}

// EMITTERS ----------------------------------------

export const submitScript = (scr, id) => {
  socket.emit("execScript", {scr, id});
}

export const runTransition = () => {
  socket.emit("transition");
}

export const changeLayout = (nextLayout) => {
  socket.emit("changeLayout", nextLayout);
}

// HANDLERS ----------------------------------------

export const LayoutDataFunctions = {};
socket.on("layoutData", (layoutData, id) => {
  console.log(LayoutDataFunctions);
  for (const fn of Object.values(LayoutDataFunctions)) fn(layoutData, id);
})