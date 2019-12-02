<script>
  import { onMount } from 'svelte';
  let Splitting;
  onMount(async () => {
    Splitting = (await import("splitting")).default;
  })

  export let submitScript;
  export let elementList;

  let selectedElement = -1;
  let newContent = '';

  const buildAndSubmit = () => {
    let inProgress = document.createElementNS(null, 'text');
    let calculated = elementList[selectedElement].calculated;

    for (const [i, line] of newContent.split('\n').entries()) {
      let tspan = document.createElementNS("http://www.w3.org/2000/svg", 'tspan');

      tspan.setAttributeNS(null, 'x', calculated.xPos);
      if (calculated.multiLine) tspan.setAttributeNS(null, 'y', calculated.firstLineYPos + calculated.lineHeight * i);
      else tspan.setAttributeNS(null, 'y', calculated.firstLineYPos);

      tspan.textContent = line;
      Splitting({
        target: tspan,
        by: 'chars'
      });
      tspan.innerHTML = tspan.innerHTML.replace(/<span/g, '<tspan').replace(/<\/span>/g, '</tspan>');
      for (const char of tspan.querySelectorAll('tspan.char')) {
        char.style.setProperty("opacity", "0");
        char.setAttributeNS(null, "dx", "50")
      }
      inProgress.appendChild(tspan);
    }

    let out = `
      let spans = document.getElementById('${elementList[selectedElement].id}').children[0];
      let res = Splitting({
        target: spans,
        by: 'chars'
      })
      spans.innerHTML = spans.innerHTML.replace(/<span/g, '<tspan').replace(/<\\/span>/g, '</tspan>')
      console.log(res[0].chars);
      
      await anime({
        targets: spans.querySelectorAll('tspan.char'),
        opacity: 0,
        duration: 1000,
        easing: 'easeInOutExpo',
        delay: anime.stagger(100, {from: 'last'})
      }).finished;
      spans.innerHTML = \`${inProgress.innerHTML}\`;
      await anime({
        targets: spans.querySelectorAll('tspan.char'),
        opacity: {
          value: 1,
          duration: 10,
        },
        fill: '#0F0',
        dx: '0',
        duration: 500,
        easing: 'easeInOutExpo',
        delay: anime.stagger(100, {from: 'first'})
      }).finished;
    `;

    submitScript(out);
  }
</script>

<style>

</style>

<select bind:value={selectedElement}>
  <option selected disabled value={-1}>...</option>
  {#each elementList as el, i}
    <option value={i}>{el.id}</option>
  {/each}
</select>
<textarea bind:value={newContent} />
<button disabled={selectedElement === -1} on:click={buildAndSubmit}>update text</button>
