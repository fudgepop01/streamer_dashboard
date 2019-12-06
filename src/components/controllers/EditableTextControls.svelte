<script>
  import { onMount } from 'svelte';

  let Splitting;
  onMount(async () => {
    Splitting = (await import("splitting")).default;
  })

  export let submitScript;
  export let elementStore;

  let elementList = [];
  elementStore.subscribe(value => elementList = value);

  let showOptions = false;
  let selectedElement = -1;
  let newContent = '';

  // OPTIONS -----------------------------------------------

  let alignment = 'left';
  let fillFrom = '#000';
  let fillTo = '#fff';
  let animate = true;

  // SCRIPT ------------------------------------------------

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
        char.style.setProperty("fill", fillFrom);
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
      
      if (${animate}) {
        await anime({
          targets: spans.querySelectorAll('tspan.char'),
          opacity: 0,
          duration: 500,
          easing: 'easeInOutExpo',
          delay: anime.stagger(50, {from: 'last'})
        }).finished;
        spans.innerHTML = \`${inProgress.innerHTML}\`;

        if ('${alignment}' !== 'left') {
          for (const ch of spans.children) {
            if ('${alignment}' == 'right') ch.setAttributeNS(null, 'x', ${calculated.bbox.x + calculated.bbox.width} - ch.getComputedTextLength()) 
            else ch.setAttributeNS(null, 'x', ${calculated.bbox.x + calculated.bbox.width/2} - ch.getComputedTextLength()/2) 
          }
        }

        for (const ch of spans.querySelectorAll('tspan.char')) {
          ch.setAttributeNS(null, "dx", 50)
        }

        await anime({
          targets: spans.querySelectorAll('tspan.char'),
          opacity: {
            value: 1,
            duration: 10,
          },
          fill: '${fillTo}',
          dx: '0',
          duration: 500,
          easing: 'easeInOutExpo',
          delay: anime.stagger(50, {from: 'first'})
        }).finished;
      } else {
        spans.innerHTML = \`${inProgress.innerHTML}\`;

        if ('${alignment}' === 'right') {
          for (const ch of spans.children) {
            ch.setAttributeNS(null, 'x', ${calculated.bbox.x + calculated.bbox.width} - ch.getBBox().width) 
          }
        }

        for (const ch of spans.querySelectorAll('tspan.char')) {
          ch.setAttributeNS(null, "dx", "0");
          ch.style.setProperty("fill", "${fillTo}");
          ch.style.setProperty("opacity", "1");
        }
      }
      
    `;

    submitScript(out);
  }
</script>

<style>
  .module {
    width: 100%; 
    display: grid;
    row-gap: 10px;
    box-sizing: border-box;
    padding: 10px;
  }

  textarea {
    resize: vertical;
  }

  .options-btn {
    width: 100px;
  }

  label {
    display: block;
    position: relative;
  }
  label span {
    display: block;
    bottom: 100%;
    margin-bottom: -5px;
    font-size: 15px;
    font-weight: bold;
  }
</style>

<div class="module">
  <button class="options-btn" on:click={() => showOptions = !showOptions}>{showOptions ? 'return' : 'options'}</button>
  {#if !showOptions}
    <select bind:value={selectedElement}>
    <option selected disabled value={-1}>...</option>
      {#each elementList as el, i}
        <option value={i}>{el.id}</option>
      {/each}
    </select>
    <textarea bind:value={newContent} />
    <button disabled={selectedElement === -1} on:click={buildAndSubmit}>update text</button>
  {:else}
    <label>
      <span>alignment:</span>
      <select bind:value={alignment}>
        <option value="right">right</option>
        <option value="left">left</option>
        <option value="center">center</option>
      </select>
    </label>
    <label>
      <span>fill from</span>
      <input type="text" bind:value={fillFrom} > 
    </label>
    <label>
      <span>fill to</span>
      <input type="text" bind:value={fillTo} > 
    </label>
    <label>
      <span>animate?</span>
      <input type="checkbox" bind:checked={animate} > 
    </label>
  {/if}
</div>
