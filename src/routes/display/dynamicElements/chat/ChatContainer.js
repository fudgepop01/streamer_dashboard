export const ChatContainerProcessor = {
  role: 'ChatContainer | ChatMsgContainer | Icon | MsgContent | Username | Avatar',
  process: (calculated, el, id) => {
    el.calculated = calculated;
  }
}