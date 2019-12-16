import socket from '../socket';
import ChatSv from '../../../components/display/Chat.svelte';
import * as RoleProcessors from './index';

export default (currentLayout, cb) => {
  window['layoutHandler'] = async (layout) => {
    let processing = await (await fetch(`/svg/${layout}`)).text();
    let frag = document.createRange().createContextualFragment(processing);

    let d = document.createElement("div")
    d.appendChild(frag);
    d.firstChild.setAttributeNS(null, "width", 960);
    d.firstChild.setAttributeNS(null, "height", 540);
    currentLayout.html = d;
    
    await cb();

    let dynamicElements = [];
    let chatMsgContainer;
    for (const elBase of d.querySelectorAll('*')) {
      if (elBase.id.length === 0) continue;

      let el = document.getElementById(elBase.id);
      if (el.id.includes("$$")) {
        let id = el.id.substring(0, el.id.indexOf('$$'));
        let role = el.id.substring(el.id.indexOf('$$') + 2);

        if (role === 'ChatMsgContainer') chatMsgContainer = el;
        el.role = role;

        let calculated = {};
        for (const processor of Object.values(RoleProcessors)) {
          if (processor.role.includes(role)) processor.process(calculated, el, id);
        }

        dynamicElements.push({
          id, role, calculated
        });

        el.setAttribute("id", id);
        // console.log(el);
      }
    }

    for (const [i, elBase] of Object.entries(dynamicElements)) {
      let el = document.getElementById(elBase.id);
      if (!el.calculated) continue;
      
      let bbox = el.getBBox();
      el.calculated.bbox = {
        width: bbox.width,
        height: bbox.height,
        x: bbox.x,
        y: bbox.y
      }
    }

    new ChatSv({
      target: chatMsgContainer.parentElement,
      props: {
        chatMsgEl: chatMsgContainer
      }
    })
    
    socket.emit("layoutData", dynamicElements);
  }
  
	socket.on("changeLayout", window['layoutHandler']);
}