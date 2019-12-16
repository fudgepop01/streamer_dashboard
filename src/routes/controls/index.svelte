<script>
  import { onMount } from 'svelte';

  import socket from './socket';
  import * as factories from '../../components/factories/index.js';
  import { editableTexts, layouts } from './controlStores';
  import { submitScript, runTransition, changeLayout, LayoutDataFunctions } from './messages.js'

  socket.on("initialize", (msg) => {
    layouts.set(msg);
    socket.emit("pageName", 'controls')
  })

  let layoutData = [];
  LayoutDataFunctions["dataHandler"] = ({data}) => {
    layoutData = data;
    editableTexts.set(data.filter((el) => el.role === "EditableText"));
  }

  socket.on("ChatMessage", (msg) => console.log(msg));

  const handleChange = (evt) => {
    changeLayout(evt.target.value);
  }

  let scriptingWindow;

  onMount(async () => {
    let jsPanel = (await import("jspanel4/es6module/jspanel.js")).jsPanel;
    for (const factory of Object.values(factories)) factory(jsPanel);
  })

</script>

<style>
textarea {
  font-family: "Roboto Mono";
}
</style>

choose a layout to load: 
<select on:change={handleChange}>
  <option selected disabled>...</option>
  {#each $layouts as layout}
    <option value="{layout}">{layout}</option>
  {/each}
</select>
<br/>
enter a script to execute:<br/>
<textarea bind:value={scriptingWindow}/><br/>
<button on:click={() => submitScript(scriptingWindow)}>submit script</button><br/>
<button on:click={runTransition}>run transition</button><br/>

<br/>
<span style="white-space: pre; font-family: 'Roboto Mono';">
{JSON.stringify(layoutData, null, 2)}
</span>