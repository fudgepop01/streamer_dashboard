<script>
  import SVGChatComponent from './SVGChatComponent.svelte';
  import { chatMessages } from './chatMsgStore';

  export let chatMsgEl;
  chatMsgEl.remove();

  const validRoles = [
    'Icon',
    'MsgContent',
    'Username',
    'Avatar'
  ]

  let bbox = chatMsgEl.calculated.bbox;
  let elements = [];
  for (const el of chatMsgEl.querySelectorAll('*')) {
    if (el.role === 'ChatMsgContainer') bbox = el.calculated.bbox;
    if (validRoles.includes(el.role)) {
      if (el.tagName === 'circle') {
        el.position = {
          x: parseInt(el.getAttributeNS(null, 'cx')) - bbox.x - parseInt(el.getAttributeNS(null, 'r')),
          y: parseInt(el.getAttributeNS(null, 'cy')) - bbox.y - parseInt(el.getAttributeNS(null, 'r')),
          width: parseInt(el.getAttributeNS(null, 'r')) * 2,
          height: parseInt(el.getAttributeNS(null, 'r')) * 2,
          cx: parseInt(el.getAttributeNS(null, 'cx')) - bbox.x,
          cy: parseInt(el.getAttributeNS(null, 'cy')) - bbox.y,
          r: parseInt(el.getAttributeNS(null, 'r'))
        }
      }
      else if (el.tagName === 'ellipse') {
        el.position = {
          x: parseInt(el.getAttributeNS(null, 'cx')) - bbox.x - parseInt(el.getAttributeNS(null, 'rx')),
          y: parseInt(el.getAttributeNS(null, 'cy')) - bbox.y - parseInt(el.getAttributeNS(null, 'ry')),
          width: parseInt(el.getAttributeNS(null, 'rx')) * 2,
          height: parseInt(el.getAttributeNS(null, 'ry')) * 2,
          cx: parseInt(el.getAttributeNS(null, 'cx')) - bbox.x,
          cy: parseInt(el.getAttributeNS(null, 'cy')) - bbox.y,
          rx: parseInt(el.getAttributeNS(null, 'rx')),
          ry: parseInt(el.getAttributeNS(null, 'ry')),
        }
      }
      else {
        el.position = {
          x: parseInt(el.getAttributeNS(null, 'x')) - bbox.x,
          y: parseInt(el.getAttributeNS(null, 'y')) - bbox.y,
          width: parseInt(el.getAttributeNS(null, 'width')),
          height: parseInt(el.getAttributeNS(null, 'height'))
        }
      }
      
      elements.push(el);
    }
  }

  const unsubscribe = chatMessages.subscribe((messages) => {
    elements.forEach((el) => el.content = []);
    for (const [i, message] of messages.entries()) {
      for (const el of elements) {
        switch (el.role) {
          case 'MsgContent':
            el.content[i] = document.createElement('span');
            el.content[i].innerText = message.message;
            el.content[i].style = `color: white;`
            break;
          case 'Username':
            el.content[i] = document.createElement('span');
            el.content[i].innerText = message.displayName;
            el.content[i].style = `color: #${message.color};`
            break;
          default:
            el.content[i] = document.createElement('span');
            break;
        }
      }
    }
    elements = elements;
  })

</script>

{#each new Array($chatMessages.length).fill(0) as _, i}
  <svg x={bbox.x} y={bbox.y + bbox.height * i} width={bbox.width} height={bbox.height}>
    {#each elements as el}
      <SVGChatComponent el={el} index={i} />
    {/each}
  </svg>
{/each}