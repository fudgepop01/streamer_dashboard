<script>
  import { onMount } from 'svelte';

  let Splitting;
  onMount(async () => {
    Splitting = (await import("splitting")).default;
  })

  export let submitScript;
  export let elementList;

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
    let oldOut = {
      opacity: 0,
      duration: 500,
      easing: 'easeInOutExpo',
      delay: {
        ms: 50, 
        args: {from: 'last'}
      }
    }

    let newStart = {
      opacity: 0,
      fill: fillFrom,
      scaleX: 5
    }

    let newEnd = {
      opacity: {
        value: 1,
        duration: 10,
      },
      fill: fillTo,
      dx: '0',
      scaleX: 1,
      duration: 500,
      easing: 'easeInOutExpo',
      delay: {
        ms: 50, 
        args: {from: 'first'}
      }
    }

    submitScript(`
      document.getElementById('${$elementList[selectedElement].id}')
      .replaceText(
        \`${newContent}\`,
        ${JSON.stringify({
          animate,
          alignment,
          oldOut,
          newStart,
          newEnd
        })}
      )
    `);
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
      {#each $elementList as el, i}
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
