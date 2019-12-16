<script>
  import Color from 'color';

  export let submitScript;
  export let layouts;
  export let LayoutDataFunctions;
  export let changeLayout;
  export let getNumSockets;

  let startColor = '#fff';
  let endColor = '#000';
  let parrotCount;
  let nextLayout;
  let selectedTransition;

  let socketCount = 0;
  const buildAndSubmit = async () => {
    let redDiff = Color(endColor).red() - Color(startColor).red();
    let greenDiff = Color(endColor).green() - Color(startColor).green();
    let blueDiff = Color(endColor).blue() - Color(startColor).blue();

    let out = '';
    out += `
      for (let i = 0; i < ${parrotCount}; i++) {
        let d = document.createElement('div');
        d.style = \`
          width: 100vw;
          height: 100vh;
          background-color: #\${
            (${Color(startColor).red()} + Math.floor(${redDiff}*(i+1)/${parrotCount})).toString(16).padStart(2, '0') +
            (${Color(startColor).green()} + Math.floor(${greenDiff}*(i+1)/${parrotCount})).toString(16).padStart(2, '0') +
            (${Color(startColor).blue()} + Math.floor(${blueDiff}*(i+1)/${parrotCount})).toString(16).padStart(2, '0')
          };
          top: 0;
          position: fixed;
          left: 100%;
        \`;
        d.className = 'transition'
        document.body.appendChild(d);
      }
      await anime({
        targets: document.getElementsByClassName('transition'),
        left: "0%",
        easing: "easeInExpo",
        duration: 1000,
        delay: anime.stagger(100, {from: 'first'})
      }).finished;
      window['layoutHandler']('${nextLayout}');
    `

    socketCount = (await getNumSockets()).display;
    submitScript(out);

    LayoutDataFunctions['transitionEnd'] = ({id}) => {
      submitScript(`
        await anime({
          targets: document.getElementsByClassName('transition'),
          left: "-100%",
          easing: "easeInExpo",
          duration: 1000,
          delay: anime.stagger(100, {from: 'last'})
        }).finished;
        document.querySelectorAll('.transition').forEach(el => el.remove());
      `, id)
      socketCount --;
      if (socketCount === 0) delete LayoutDataFunctions['transitionEnd'];
    }
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
  <label>
    <span>start color</span>
    <input type="text" bind:value={startColor} > 
  </label>
  <label>
    <span>end color</span>
    <input type="text" bind:value={endColor} > 
  </label>
  <label>
    <span>parrot count</span>
    <input type="number" bind:value={parrotCount} > 
  </label>
  <label>
    <span>next layout</span>
    <select bind:value={nextLayout}>
      <option value="none" selected>no change</option>
      {#each $layouts as layout}
        <option value={layout} >{layout}</option>
      {/each}
    </select>
  </label>
  <label>
    <span>transition type</span>
    <select bind:value={selectedTransition}>
      <option value="rectangles" selected>rectangles</option>
    </select>
  </label>

  <button on:click={buildAndSubmit}>play transition</button>
</div>