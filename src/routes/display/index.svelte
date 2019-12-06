<script>
  import Transition from '../../components/transition.svelte';

  import io from 'socket.io-client';
  import { onMount, tick } from 'svelte';
  import anime from 'animejs/lib/anime.es.js';
  window["anime"] = anime;

  const socket = io();
  let transition = false;

  socket.on("initialize", (msg) => {
    socket.emit("pageName", 'display')
  })

  socket.on("execScript", async (msg) => {
    eval(`(async () => {${msg}})()`);
  })

  socket.on("transition", () => {
    console.log('recieved message');
    transition = true;
  })

  let currentLayout = '';
	socket.on("changeLayout", async (layout) => {
    let processing = await (await fetch(`/svg/${layout}`)).text();
    let frag = document.createRange().createContextualFragment(processing);

    let dynamicElements = [];
    for (const el of frag.querySelectorAll('*')) {
      // console.log(el);
      if (el.id.includes("$$")) {
        let id = el.id.substring(0, el.id.indexOf('$$'));
        let role = el.id.substring(el.id.indexOf('$$') + 2);
        
        let calculated = {};
        if (role === "EditableText") {
          let ch = el.children[0];
          calculated.firstLineYPos = parseFloat(ch.children[0].getAttributeNS(null, 'y'));
          calculated.xPos = parseFloat(ch.children[0].getAttributeNS(null, 'x'));

          if (ch.children.length > 1) {
            calculated.multiLine = true;
            calculated.lineHeight = parseFloat(ch.children[1].getAttributeNS(null, 'y')) - parseFloat(ch.children[0].getAttributeNS(null, 'y'));
          }

          calculated.fontFamily = ch.getAttributeNS(null, 'font-family');
          calculated.color = ch.getAttributeNS(null, 'fill');
          calculated.fontSize = ch.getAttributeNS(null, 'font-size');
        }

        dynamicElements.push({
          id, role, calculated
        });

        el.setAttribute("id", id);
        // console.log(el);
      }
    }

    let d = document.createElement("div")
    d.appendChild(frag);
    currentLayout = d;

    await tick();

    for (const [i, el] of Object.entries(dynamicElements)) {
      let bbox = document.getElementById(el.id).getBBox();
      dynamicElements[i].calculated.bbox = {
        width: bbox.width,
        height: bbox.height,
        x: bbox.x,
        y: bbox.y
      }
    }

    socket.emit("layoutData", dynamicElements);
  });
  
  onMount(async () => {
    window["Splitting"] = (await import("splitting")).default;
  })
</script>

{@html currentLayout.innerHTML}
{#if transition}
  <Transition bind:transition={transition} parrotCount={10}/>
{/if}

