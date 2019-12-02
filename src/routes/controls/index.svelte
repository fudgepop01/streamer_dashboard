<script>
  import io from 'socket.io-client';
  import ETC from '../../components/controllers/EditableTextControls.svelte';

  const socket = io();
  let layouts = [];

  socket.on("initialize", (msg) => {
    layouts = msg;
    socket.emit("pageName", 'controls')
  })

  let layoutData = [];
  let editableTexts = [];
  socket.on("layoutData", (data) => {
    layoutData = data;
    editableTexts = data.filter((el) => el.role === "EditableText");
  })

  socket.on("ChatMessage", (msg) => console.log(msg));

  const handleChange = (evt) => {
    socket.emit("changeLayout", evt.target.value);
  }

  let scriptingWindow;
  const submitScript = (scr) => {
    socket.emit("execScript", scr);
  }

  const runTransition = () => {
    socket.emit("transition");
  }
</script>

<style>
textarea {
  font-family: "Roboto Mono";
}
</style>

choose a layout to load: 
<select on:change={handleChange}>
  <option selected disabled>...</option>
  {#each layouts as layout}
    <option value="{layout}">{layout}</option>
  {/each}
</select>
<br/>
enter a script to execute:<br/>
<textarea bind:value={scriptingWindow}/><br/>
<button on:click={() => submitScript(scriptingWindow)}>submit script</button><br/>
<button on:click={runTransition}>run transition</button><br/>

<ETC submitScript={submitScript} bind:elementList={editableTexts}/>

<br/>
<span style="white-space: pre; font-family: 'Roboto Mono';">
{JSON.stringify(layoutData, null, 2)}
</span>