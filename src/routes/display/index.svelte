<script>
  import { onMount, tick } from 'svelte';

  import socket from './socket';
  import { initRecievers } from './messages';
  import init from './dynamicElements/initialize';
  import * as RoleProcessors from './dynamicElements/index';

  import anime from 'animejs/lib/anime.es.js';
  window["anime"] = anime;
  
  initRecievers();

  let currentLayout = {html: ''};
  init(currentLayout, async () => {
    currentLayout = currentLayout;
    await tick();
  });

  window['currentLayout'] = currentLayout;

  
  onMount(async () => {
    window["Splitting"] = (await import("splitting")).default;
  })
</script>

{@html currentLayout.html.innerHTML}
