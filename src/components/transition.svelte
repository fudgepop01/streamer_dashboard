<script>
  import { onMount } from 'svelte';
  import anime from 'animejs/lib/anime.es.js';
  
  export let rgbFrom = [0, 200, 255];
  export let rgbTo = [0, 0, 0];
  export let parrotCount = 5;
  // export let verticalChunks = 10;

  export let transition;

  let chunks = [];

  onMount(() => {
    const tl = anime.timeline({
      complete() {
        transition = false;
      }
    });
    tl.add({
      targets: chunks,
      left: "0%",
      easing: "easeInExpo",
      duration: 1000,
      delay: anime.stagger(100, {from: 'first'})
    })
    tl.add({
      targets: chunks,
      left: "-100%",
      easing: "easeOutExpo",
      duration: 1000,
      delay: anime.stagger(100, {from: 'last'})
    })
  })
</script>

{#each new Array(parrotCount + 1).fill(0) as _, i}
  <div 
    bind:this={chunks[i]}
    style="background-color: #{
      Math.floor(rgbFrom[0] + (rgbTo[0] - rgbFrom[0])*i/(parrotCount)).toString(16).padStart(2, '0') +
      Math.floor(rgbFrom[1] + (rgbTo[1] - rgbFrom[1])*i/(parrotCount)).toString(16).padStart(2, '0') +
      Math.floor(rgbFrom[2] + (rgbTo[2] - rgbFrom[2])*i/(parrotCount)).toString(16).padStart(2, '0')
    };
    width: 100vw;
    height: 100vh;
    position: fixed;
    top: 0;
    left: 100%;
    " 
  />
{/each}

